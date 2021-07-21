import React from "react";

import { HowToPlaySection } from "./components/howToPlaySection/howToPlaySection";
import { HowToPlaySectionText } from "./components/howToPlaySection/howToPlaySectionText";
import { IconStatement } from "../../components/iconStatement/iconStatement";
import { Matchup } from "../gamePage/components/matchup/matchup";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { GamePageContext } from "../gamePage/gamePage";

import { HowToPlayUtility } from "./utilities/howToPlayUtility";

import { defaultGamePageState } from "../gamePage/models/gamePageState";

import { Icon } from "../../../stroll-enums/icon";
import { HowToPlaySubSection } from "./components/howToPlaySection/howToPlaySubSection";

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
          <HowToPlaySectionText text="Games last between 1 and 7 days." />
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
            <HowToPlaySectionText text={`
              Before the game begins, the first day's matchups will be open for predictions. 
              Using the prediction input either on the left or right side, the other players are encouraged to use their points to predict which player they believe will out-step their competitor.
            `} />        
            <HowToPlaySectionText text={`
              As you spend your available points on predictions, you will notice they are subtracted from the available points displayed at the bottom of your screen, but not from the total points.
              This is due to the fact that your total points is a reflection of your available points plus your outstanding points in matchups you have wagered on.
            `} />
            <HowToPlaySectionText text="At the end of the day, players who predicted correctly will earn points based on the displayed return ratio." />
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Matchup Stats">
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Dice} text="1 : 1.5" /></h1>
            <HowToPlaySectionText text="In our example above, the left side's return ratio is 1:1.5. So for every 100 points wagered, 150 points would be returned." />
            <HowToPlaySectionText text="In addition to the return ratio, a few other stats are displayed on each side of the matchup." />        
            <HowToPlaySectionText text="The first is steps:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Steps} text="0" /></h1>
            <HowToPlaySectionText text="This is the total number of steps this player has taken today. In this example, since the day has not started yet, the number of steps is 0." />        
            <HowToPlaySectionText text="Next is the total wagered:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon={Icon.Points} text="5,000" /></h1>
            <HowToPlaySectionText text="This is the total amount that other players have wagered on this player for this matchup." />
            <HowToPlaySectionText text="Finally, at the bottom, we have participants:" />
            <h1 className="example-matchup-side-stat passion-one-font"><IconStatement icon="fal fa-user-friends" text="2" /></h1>
            <HowToPlaySectionText text="This is the total number of players who have wagered on this player for this matchup." />
          </HowToPlaySubSection>
          <HowToPlaySubSection title="Automatic Self Prediction">
            <HowToPlaySectionText text="One important thing to note is that the game will automatically place a prediction on you on your behalf." /> 
            <HowToPlaySectionText text={`
              This prediction does not come from your pool of available points, but are instead additional points generated by the game. 
              These points will not be deducted from your points if the prediction winds up being incorrect, but players who bet on the opposing player can win them should you lose your matchup.
            `} />
          </HowToPlaySubSection>
        </HowToPlaySection>      
        <HowToPlaySection title="Good luck!">
          <HowToPlaySectionText text="Should you take enough steps and use your points to predict correctly, you might just end up winning!" />                  
        </HowToPlaySection>
        <HowToPlaySection title="Thanks for playing and I hope you have fun!" />
      </div>
    </Page>
  )
}