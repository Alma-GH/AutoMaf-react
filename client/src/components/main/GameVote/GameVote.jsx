import React from 'react';
import cls from "./GameVote.module.scss"

const GameVote = ({vis}) => {

  //temp data
  let playersVotes = [
    {who: "Darya", voteFor:"Roman", count: 0},
    {who: "Nikita", voteFor:"", count: 0},
    {who: "Roman", voteFor:"-", count: 1},
  ]
  playersVotes.sort((a,b)=>b.count-a.count)

  let style = [cls.parent]
  if(vis) style.push(cls.vis)
  return (
    <div className={style.join(" ")}>
      <div className={cls.head}>
        <h4>Промежуточное голосование</h4>
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
          {playersVotes.map(player=>(
            <tr key={player.who}>
              <td>{player.who}</td>
              <td>{player.voteFor}</td>
              <td>{player.count}/{playersVotes.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameVote;