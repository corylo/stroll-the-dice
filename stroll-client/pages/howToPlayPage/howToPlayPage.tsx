import React from "react";

import { HowToPlaySection } from "./components/howToPlaySection/howToPlaySection";
import { HowToPlaySectionText } from "./components/howToPlaySection/howToPlaySectionText";
import { HowToPlaySubSection } from "./components/howToPlaySection/howToPlaySubSection";
import { IconStatement } from "../../components/iconStatement/iconStatement";
import { Matchup } from "../gamePage/components/matchup/matchup";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { GamePageContext } from "../gamePage/gamePage";

import { HowToPlayUtility } from "./utilities/howToPlayUtility";

import { defaultGamePageState } from "../gamePage/models/gamePageState";

import { Icon } from "../../../stroll-enums/icon";

interface HowToPlayPageProps {
  
}

export const HowToPlayPage: React.FC<HowToPlayPageProps> = (props: HowToPlayPageProps) => { 
  const getExampleMatchup = (): JSX.Element => {
    return (      
      <GamePageContext.Provider value={{ state: defaultGamePageState(), setState: () => {}}}>
        <Matchup 
          dayStatus={null} 
          matchup={HowToPlayUtility.getExampleMatchup()} 
          predictions={[]}
        />
      </GamePageContext.Provider>
    )
  }

  return(
    <Page id="how-to-play-page">     
      <PageTitle text="Huh?" />
      <div className="how-to-play-page-sections">
        <HowToPlaySection title="What is this?">
          <HowToPlaySectionText text="Stroll The Dice is the combination of a stepping (walking / running) and a prediction game rolled into one." />
        </HowToPlaySection>
        <HowToPlaySection title="What is the goal of the game?">
          <HowToPlaySectionText text="Ultimately, your goal as a player is to have the most points at the end of the game." />
          <HowToPlaySectionText text="You are not only trying to gain points through stepping, but also attempting to gain additional points by predicting how well your fellow competitors will do against each other." />
        </HowToPlaySection>
        <HowToPlaySection title="How does the game work exactly?">
          <HowToPlaySectionText text="Games last between 1 and 7 days and can start at any hour of day." />
          <HowToPlaySectionText text="Players will start the game with 10,000 points. Throughout each day, as you take steps, you will periodically gain points at a rate of 1 point per step." />        
          <HowToPlaySubSection title="Matchups">
            <HowToPlaySectionText text="For each day of the game, players will be matched up against one another with the goal of stepping more than the player they are paired against." />    
            <HowToPlaySectionText text="The number of players in the game will determine the number of matchups per day. For example, if you have 10 players, then there will be 5 matchups per day." />
            <HowToPlaySectionText text="Here is an example of what a matchup looks like:" />
          </HowToPlaySubSection>
        </HowToPlaySection>
        {getExampleMatchup()}
        <HowToPlaySection>
          <HowToPlaySubSection>            
            <HowToPlaySectionText text="In the above example, player 1 has been matched up against player 2 for the first day." />          
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Predictions">
            <HowToPlaySectionText text="Before each day begins, the matchups for that day will be open for predictions." /> 
            <HowToPlaySectionText text="Using the prediction input on either the left or right side, the other players are encouraged to use their points to predict which player they believe will out-step their competitor." />        
            <HowToPlaySectionText text="At the end of the day, players who predicted correctly will earn points based on the displayed return ratio. Players who predicted incorrectly will lose any points wagered." />
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Available Points vs. Total Points">
            <HowToPlaySectionText text="As you spend your available points on predictions, you will notice they are subtracted from the available points displayed at the bottom of your screen, but not from the total points." />
            <HowToPlaySectionText text="This is due to the fact that your total points is a reflection of your available points plus your outstanding points in the matchups you have wagered on." />            
            <HowToPlaySectionText text="At the end of the day, when prediction results are being calculated, your available and total points will be updated to reflect wins and losses accordingly." />
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Matchup Stats">
            <HowToPlaySectionText text="On each side of the matchup you will notice there are four stats listed. To continue our point about predicting correctly, let's start with the second stat, Return Ratio:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Dice} text="1 : 1.5" /></h1>
            <HowToPlaySectionText text="In our example matchup above, the left side's return ratio is 1:1.5. So for every 100 points wagered, 150 points would be returned." />            
            <HowToPlaySectionText text="The return ratio is calcuated based on the total wagered on either side of the matchup." />
            <HowToPlaySectionText text="The following formula can be used to determine the left side's return ratio:" />
            <HowToPlaySectionText text="(5,000 + 2,500) / 5,000 = 1.5" />
            <HowToPlaySectionText text="And for the right side's return ratio:" />
            <HowToPlaySectionText text="(5,000 + 2,500) / 2,500 = 3.0" />
            <HowToPlaySectionText text="Continuing on to the remaining stats, the first stat listed is Steps:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Steps} text="0" /></h1>
            <HowToPlaySectionText text="This is the total number of steps this player has taken so far in the current day. In this example, since the day has not started yet, the number of steps is 0." />        
            <HowToPlaySectionText text="Number of steps is updated hourly, but can vary based on when your connected step tracker's data gets updated." />
            <HowToPlaySectionText text="The third stat listed is Total Wagered:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Points} text="5,000" /></h1>
            <HowToPlaySectionText text="This is the total amount that other players have wagered on this player for this matchup." />
            <HowToPlaySectionText text="The final stat listed is Participants:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon="fal fa-user-friends" text="2" /></h1>
            <HowToPlaySectionText text="This is the total number of players who have wagered on this player for this matchup." />
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Automatic Self Prediction">
            <HowToPlaySectionText text="One important thing to note is that the game will automatically place a prediction on you on your behalf." /> 
            <HowToPlaySectionText text="The points for this initial prediction do not come from your pool of available points, but are instead additional points generated by the game." />
            <HowToPlaySectionText text="These additional points cannot be lost, only won by you and other players who predict correctly." />
            <HowToPlaySectionText text="The last point to be made here is that you may choose to add more of your own points to the automatic self prediction. These points can be won or lost as usual." />
          </HowToPlaySubSection>
        </HowToPlaySection>      
        <HowToPlaySection title="Good luck!">
          <HowToPlaySectionText text="Should you use your steps and predictive abilities wisely, you may just end up with enough points to win!" />                  
        </HowToPlaySection>
        <HowToPlaySection title="Thanks for playing and I hope you have fun!" />
      </div>
    </Page>
  )
}