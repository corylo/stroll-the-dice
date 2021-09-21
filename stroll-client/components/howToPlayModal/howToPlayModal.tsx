import React, { useEffect } from "react";

import { Button } from "../buttons/button";
import { ConnectAStepTrackerItem } from "../connectAStepTrackerMessage/connectAStepTrackerItem/connectAStepTrackerItem";
import { ExampleMatchup } from "../exampleMatchup/exampleMatchup";
import { HowToPlayDisplayComponent } from "./components/howToPlayDisplayComponent/howToPlayDisplayComponent";
import { HowToPlayModalSection } from "./components/howToPlayModalSection/howToPlayModalSection";
import { HowToPlayText } from "./components/howToPlayText/howToPlayText";
import { HowToPlayTextSubnote } from "./components/howToPlayText/howToPlayTextSubnote";
import { IconStatement } from "../iconStatement/iconStatement";
import { Label } from "../label/label";
import { Modal } from "../modal/modal";
import { ModalBody } from "../modal/modalBody";
import { ModalTitle } from "../modal/modalTitle";
import { PlayerLevelExperienceTable } from "../playerLevelExperienceTable/playerLevelExperienceTable";

import { HowToPlayUtility } from "../../utilities/howToPlayUtility";
import { ImageUtility } from "../../utilities/imageUtility";
import { MatchupUtility } from "../../utilities/matchupUtility";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { IMatchup, IMatchupSide } from "../../../stroll-models/matchup";
import { IProfileReference } from "../../../stroll-models/profileReference";

import { HowToPlayID } from "../../enums/howToPlayID";
import { Icon } from "../../../stroll-enums/icon";
import { MatchupLeader } from "../../../stroll-enums/matchupLeader";
import { MatchupSideAlignment } from "../../pages/gamePage/components/matchupSide/matchupSide";
import { PlayerLevelConstraint } from "../../../stroll-enums/playerLevelConstraint";
import { StepTracker } from "../../../stroll-enums/stepTracker";

interface HowToPlayModalProps {  
  howToPlay: boolean;
  howToPlayID: HowToPlayID;
  toggle: (toggled: boolean) => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = (props: HowToPlayModalProps) => { 
  const { howToPlay, howToPlayID, toggle } = props;

  useEffect(() => {
    if(howToPlay && howToPlayID !== HowToPlayID.Unknown) {
      const modal: HTMLElement = document.getElementById("how-to-play-modal"),
        element: HTMLElement = document.getElementById(howToPlayID);

      if(modal && element) {
        const rect: DOMRect = element.getBoundingClientRect();

        modal.scrollTop = rect.top - 40;
      }
    }
  }, [howToPlay, howToPlayID]);

  if(howToPlay) {    
    const handleOnClose = (): void => {
      toggle(false);
    }

    const getExampleMatchup = (): IMatchup => {
      const matchup: IMatchup = HowToPlayUtility.getExampleMatchup();

      matchup.left.steps = NumberUtility.random(2000, 9999);      
      matchup.left.total.wagered = NumberUtility.random(20000, 40000);   
      matchup.left.total.participants = NumberUtility.random(5, 10);     

      matchup.right.steps = NumberUtility.random(2000, 9999);
      matchup.right.total.wagered = NumberUtility.random(20000, 40000);     
      matchup.right.total.participants = NumberUtility.random(5, 10);
      
      matchup.favoriteID = NumberUtility.random(1, 2) % 2 === 0 ? matchup.left.playerID : matchup.right.playerID;
      matchup.spread = NumberUtility.random(1000, 5000);

      return matchup;
    }

    const matchup: IMatchup = getExampleMatchup();

    const underdogSide: IMatchupSide = MatchupUtility.getSideByFavorite(matchup, false);

    const getLeaderStatement = (): string[] => {
      const leaderID: string = MatchupUtility.getLeader(matchup);

      if(leaderID === MatchupLeader.Tie) {
        return [
          "This means the matchup is tied!",
          "In the rare event that a matchup ends in a tie, all players who predicted on this matchup would lose their points!"
        ]
      }

      const leader: IProfileReference = leaderID === matchup.left.playerID
        ? matchup.left.profile
        : matchup.right.profile
      
      const loser: IProfileReference = leaderID === matchup.left.playerID
        ? matchup.right.profile
        : matchup.left.profile
      
      return [
        `This means that ${leader.username} is in the lead!`,
        `If the matchup ended right now, all players who predicted ${leader.username} would win their share of any points wagered on ${loser.username}.`
      ]
    }

    const getReturnRatio = (side: MatchupSideAlignment): string => {
      const formatRatio = (value: number): string => {
        return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
      }

      if(side === MatchupSideAlignment.Left) {
        return formatRatio(MatchupUtility.calculateRatio(matchup.left, matchup.right));
      }

      return formatRatio(MatchupUtility.calculateRatio(matchup.right, matchup.left));
    }

    const leftReturnRatio: string = getReturnRatio(MatchupSideAlignment.Left),
      rightReturnRatio: string = getReturnRatio(MatchupSideAlignment.Right);

    const predictionAmount: number = 1000,
      returnedAmount: number = parseFloat(leftReturnRatio) * predictionAmount,
      netAmount: number = returnedAmount - predictionAmount;

    return (
      <Modal id="how-to-play-modal" priority>        
        <div className="how-to-play-modal-background-wrapper">
          <div className="how-to-play-modal-background" style={{ backgroundImage: `url(${ImageUtility.getGraphic("learn-more", "png")})`}} />
        </div>
        <ModalTitle handleOnClose={handleOnClose} />
        <ModalBody>   
          <Label
            className="how-to-play-title"
            icon="fal fa-question"
            text="How To Play"
          />          
          <div className="how-to-play-modal-sections">
            <HowToPlayModalSection title="Prerequisites" id={HowToPlayID.Prerequisites}>
              <HowToPlayModalSection className="step-tracking-sub-section" title="1. Step tracking" subsection>
                <HowToPlayText text="In order for the game to be able to track your steps you must connect a step tracker." />
                <HowToPlayText text="The available step trackers are listed below." />
                <HowToPlayDisplayComponent className="step-tracking-sub-section-items">                  
                  <ConnectAStepTrackerItem tracker={StepTracker.GoogleFit} />
                  <ConnectAStepTrackerItem tracker={StepTracker.Fitbit} />
                </HowToPlayDisplayComponent>
                <HowToPlayText text="You can visit the step tracker section of the profile page to connect your tracker." />
                <HowToPlayDisplayComponent>
                  <Button className="fancy-button" url="/profile" handleOnClick={handleOnClose}>
                    <i className={Icon.User} />
                    <h1 className="passion-one-font">Go to Profile</h1>
                  </Button>
                </HowToPlayDisplayComponent>
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. Game Days" subsection>
                <HowToPlayText text="In order to create or join a game you will need to purchase Game Days. One Game Day is required for each day of the duration of the game you have selected." />
                <HowToPlayText text="For example, if you wanted to create or join a game that was 5 days long, you would need to purchase at least 5 Game Days." />
                <HowToPlayText text="Game Days can be purchased in the Shop for as low as $0.21 per day!" />
                <HowToPlayDisplayComponent>
                  <Button className="fancy-button" url="/shop" handleOnClick={handleOnClose}>
                    <i className="fal fa-store" />
                    <h1 className="passion-one-font">Go to Shop</h1>
                  </Button>
                </HowToPlayDisplayComponent>
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="Getting Started" id={HowToPlayID.GettingStarted}>
              <HowToPlayModalSection title="For more info on Game Days, please see the Preqrequisites section." subsection />
              <HowToPlayModalSection title="1. Create a game" subsection>
                <HowToPlayText text="To create a game, click the 'Create Game' button or + icon on mobile." />
                <HowToPlayText text="Enter a name for your game, select a duration and start time, and you're ready to go." />
                <HowToPlayText text="You can optionally enable the the 'Gift My Game Days' option if you'd like to share your Game Days with players joining your game." />
                <HowToPlayDisplayComponent>
                  <Button className="fancy-button" url="/create" handleOnClick={handleOnClose}>
                    <i className="fal fa-plus" />
                    <h1 className="passion-one-font">Create Game</h1>
                  </Button>
                </HowToPlayDisplayComponent>
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. Invite players" subsection>
                <HowToPlayText text="To invite players click the invite button at the top of the game page and copy the invite link." />
                <HowToPlayText text="Share this link with anyone you'd like to play with. There can be up to 20 players in a game, including the creator." />
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="The Goal" id={HowToPlayID.TheGoal}>
              <HowToPlayModalSection title="1. What?" subsection>
                <HowToPlayText text="Ultimately, your goal as a player is to have the most points at the end of the game." />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. How?" subsection>
                <HowToPlayText text="There are two ways to earn points. Taking steps and predicting matchup outcomes." />
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="How it works" id={HowToPlayID.HowItWorks}>
              <HowToPlayModalSection title="1. What?" subsection>
                <HowToPlayText text="Players start with 10,000 points each." />
                <HowToPlayText text="Each day players are randomly matched up against each other.">
                  <HowToPlayTextSubnote text="The exception to this is that on the first day, players are matched up in the order they join." />
                </HowToPlayText>
                <HowToPlayText text="Before the start of each day, players have the option to spend their points predicting the winner of each matchup.">                  
                  <HowToPlayTextSubnote text="Spend as many or as few points as you'd like. The choice is yours!" />
                </HowToPlayText>
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. When?" subsection>
                <HowToPlayText text="Games last between 1 and 7 days and can start at any hour of the day." />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="3. How?" subsection>
                <HowToPlayText text="Players earn points at a rate of 1 point per step. This is the most guaranteed way to gain points." />
                <HowToPlayText text={[
                  "The second, more lucrative (and riskier) way to earn points is through matchup predictions.",
                  "If you correctly predict the winner, you will win your share of any points wagered on the opposing player."
                ]} />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="4. Why?" subsection>
                <HowToPlayText text="The player with the most points at the end of the game wins!" />
                <HowToPlayText text={[
                  "Will you choose the safer, guaranteed way of earning points via steps?",
                  "Or will you go the risky route and wager them all?",
                  "Perhaps a combination of both! The choice is yours!"
                ]}/>
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="Matchups" id={HowToPlayID.Matchups}>
              <HowToPlayModalSection title="1. Summary" subsection>
                <HowToPlayText text="Each day players are randomly matched up against each other.">
                  <HowToPlayTextSubnote text="The exception to this is that on the first day, players are matched up in the order they join." />
                </HowToPlayText>
                <HowToPlayText text={[
                  "The number of players in the game will determine the number of matchups per day.", 
                  "For example, if you have 10 players, then there will be 5 matchups per day." 
                ]} />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. Example" subsection>
                <HowToPlayText text="Here is an example of what a matchup looks like." />
                <HowToPlayDisplayComponent>
                  <ExampleMatchup matchup={matchup} />
                </HowToPlayDisplayComponent>
              </HowToPlayModalSection>
              <HowToPlayModalSection title="3. Breakdown" subsection>
                <HowToPlayText text={[
                  "In any given matchup there are five key stats listed on either side.",
                  "The first stat is total steps." 
                ]} />
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Steps} text={matchup.left.steps.toLocaleString()} /></h1>
                </HowToPlayDisplayComponent>
                <HowToPlayText text={[
                  `In this example, ${matchup.left.profile.username} has taken ${matchup.left.steps.toLocaleString()} steps and ${matchup.right.profile.username} has taken ${matchup.right.steps.toLocaleString()} steps.`,
                  ...getLeaderStatement()
                ]} />
                <HowToPlayText text="The second stat is spread." />
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Spread} text={matchup.spread.toLocaleString()} /></h1>
                </HowToPlayDisplayComponent>
                <HowToPlayText text={[
                  "The spread is the number of steps that the matchup favorite is predicted to win by and is calculated using the average number of daily steps for each player.",                  
                  "The spread is used purely for calculating prediction outcomes and has no effect on the actual matchup winner."
                 ]} />
                <HowToPlayText text={[
                  `In this example, the spread is ${matchup.spread.toLocaleString()}.`,
                  "For all intents and purposes the spread is the number of steps subtracted from the favorite when determining prediction results.",
                  "If, after the spread has been subtracted, the favorite has not taken more steps than the underdog, then predictions placed on the favorite would result in a loss."
                ]} />
                <HowToPlayText text={[
                  "In this example, the number of steps the matchup favorite would have to take to win (based on current step values) would be:",                  
                  `${underdogSide.steps.toLocaleString()} + ${matchup.spread.toLocaleString()} + 1 = ${(underdogSide.steps + matchup.spread + 1).toLocaleString()}`
                ]} />
                <HowToPlayText text="The next stat is total wagered." />
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Points} text={NumberUtility.shorten(matchup.left.total.wagered)} /></h1>
                </HowToPlayDisplayComponent>
                <HowToPlayText text={`In this example, there are ${NumberUtility.shorten(matchup.left.total.wagered)} points wagered on ${matchup.left.profile.username} and ${NumberUtility.shorten(matchup.right.total.wagered)} points wagered on ${matchup.right.profile.username}.`} />
                <HowToPlayText text="This leads us to the next stat, return ratio." />                   
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Dice} text={`1 : ${leftReturnRatio}`} /></h1>
                </HowToPlayDisplayComponent>
                <HowToPlayText text="Unlike traditional vegas odds, return ratio is calculated based on the total wagered on either side.">
                  <HowToPlayTextSubnote text="If there are only points wagered on one side, the return ratio will remain 1 : 1." />
                </HowToPlayText>
                <HowToPlayText text={`In this example, the return ratio for ${matchup.left.profile.username} is 1 : ${leftReturnRatio} and the return ratio for ${matchup.right.profile.username} is 1 : ${rightReturnRatio}.`} />
                <HowToPlayText text="For more information on how return ratio works continue on to the Prediction section." />
                <HowToPlayText text="The final stat is participants. This stat is purely informational." />
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Players} text={matchup.left.total.participants.toString()} /></h1>
                </HowToPlayDisplayComponent>
                 <HowToPlayText text={`In this example, there are ${matchup.left.total.participants} participants who have predicted ${matchup.left.profile.username} and ${matchup.right.total.participants} participants who have predicted ${matchup.right.profile.username}.`} />
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="Predictions" id={HowToPlayID.Predictions}>
              <HowToPlayModalSection title="This section is a continuation of the Matchups section." subsection />
              <HowToPlayModalSection title="1. Summary" subsection>
                <HowToPlayText text="The goal of predicting is to win extra points by correctly guessing the winner of a given matchup." />
                <HowToPlayText text={[
                  "Assuming there are points wagered on both sides of a matchup, you will either:",
                  "A. Win points if you guess correctly.",
                  "B. Lose points if you guess incorrectly."
                ]} />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. Breakdown" subsection>
                <HowToPlayText text="The number of points you will win, assuming you've predicted correctly, is determined by the return ratio stat listed under the player you've predicted on." />
                <HowToPlayDisplayComponent>
                  <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Dice} text={`1 : ${leftReturnRatio}`} /></h1>
                </HowToPlayDisplayComponent>
                <HowToPlayText text={`Based on the example from the matchups section, the return ratio for Player 1 is ${leftReturnRatio}.`} />
                <HowToPlayText text={`This means that for every point you wagered on Player 1, you would be returned ${leftReturnRatio} points.`} />
                <HowToPlayText text={`So if you wagered ${predictionAmount.toLocaleString()} points you would be returned ${returnedAmount.toLocaleString()} points for a net gain of ${netAmount.toLocaleString()} points.`} />
                <HowToPlayText text={[
                  "The formula for calculating the return ratio is as follows:",
                  "Total Wagered On The Matchup / Total Wagered On Your Pick",
                  "In this example, if you predicted Player 1, the corresponding values would be:",
                  `(${matchup.left.total.wagered.toLocaleString()} + ${matchup.right.total.wagered.toLocaleString()}) / ${matchup.left.total.wagered.toLocaleString()} = ${leftReturnRatio}`
                ]} />
                <HowToPlayText text="As a final note, any fractional points won are rounded to the nearest whole number." />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="3. Conclusion" subsection>
                <HowToPlayText text={[
                  "Should you use your steps and predictive abilities wisely, you may just end up with enough points to win!",
                  "Good luck!"
                 ]} />
              </HowToPlayModalSection>
            </HowToPlayModalSection>
            <HowToPlayModalSection title="Leveling" id={HowToPlayID.Leveling}>
              <HowToPlayModalSection title="1. Summary" subsection>
                <HowToPlayText text="When you complete a game, you will gain experience points or XP. If you accrue enough XP, you will level up!" />
                <HowToPlayText text={[
                  "For any given game, XP will be distrubuted based on the greater of the following two values:",
                  "- Total Steps",
                  "- Total Points",                  
                ]} />
                <HowToPlayText text={[
                  "For example, if you do well in your predictions, you will likely have more points than steps and therefore you will earn 1 XP for every point you earned.", 
                  "If, on the other hand, you do not do well in your predictions, then you will probably have more steps than points and will earn 1 XP for each step you took."
                ]} />
              </HowToPlayModalSection>
              <HowToPlayModalSection title="2. Leveling Chart" subsection>
                <HowToPlayText text={[
                  `Levels ${PlayerLevelConstraint.MinimumLevel} - ${PlayerLevelConstraint.MinimumLevelForExponentialXP} are on a linear scale. For every 18,000 XP you earn you will level up once.`,
                  `For levels ${PlayerLevelConstraint.MinimumLevelForExponentialXP + 1} - ${PlayerLevelConstraint.MaximumLevel - 1} the leveling scale becomes exponential (${PlayerLevelConstraint.Exponential}x multiplier).`,
                  `For the max level of ${PlayerLevelConstraint.MaximumLevel} the experience required is double that of level ${PlayerLevelConstraint.MaximumLevel - 1}.`
                ]} />
                <HowToPlayDisplayComponent>
                  <PlayerLevelExperienceTable />
                </HowToPlayDisplayComponent>
              </HowToPlayModalSection>
            </HowToPlayModalSection>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  return null;
}