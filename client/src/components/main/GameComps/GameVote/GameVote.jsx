import React, {useContext} from 'react';
import cls from "./GameVote.module.scss"
import {RoomContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";
import {PHASE_DAY_SUBTOTAL, PHASE_DAY_TOTAL} from "../../../../tools/const";


const GameVote = ({vis}) => {

  const context = useContext(RoomContext)
  const room = context.room
  const game = GameService.getGame(room)
  const table = GameService.getTableVotes(game)
  const phase = GameService.getPhase(game)

  const readTable = table
    ?.map(row=>{
      const voter = GameService.getPlayerByID(row[0], game)
      const vote = GameService.getPlayerByID(row[1], game)
      return ({
          who: GameService.getName(voter),
          voteFor: GameService.getName(vote),
          count: GameService.getNumVotesFromTable(voter,game)
        })
    })
    .sort((a,b)=>b.count-a.count)

  function getHeadByPhase(phase){
    const map = {
      [PHASE_DAY_SUBTOTAL]: "Промежуточное голосование",
      [PHASE_DAY_TOTAL]: "Итоговое голосование"
    }
    if(!map[phase])
      return "Голосование не началось"
    return map[phase]
  }

  let style = [cls.parent]
  if(vis) style.push(cls.vis)
  return (
    <div className={style.join(" ")}>
      <div className={cls.head}>
        <h4>{getHeadByPhase(phase)}</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>Кто</th>
            <th>За кого</th>
            <th>Гол.</th>
          </tr>
        </thead>


        <tbody>
          {readTable?.map(player=>(
            <tr key={player.who}>
              <td>{player.who}</td>
              <td>{player.voteFor}</td>
              <td>{player.count}/{readTable.length-1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameVote;