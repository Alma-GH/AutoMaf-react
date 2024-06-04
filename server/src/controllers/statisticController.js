const client = require("../db/dbClient.js")
const {ObjectId} = require("mongodb");
const Game = require("../class/Game.js")
const Onside = require("../class/Onside.js")


class StatisticController {

  async statistic(req, res) {
    const user = req.user
    console.log({user})
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const statisticCollection = db.collection('statistic');

      const statOfUser = await statisticCollection.findOne({player: new ObjectId(user.userId)});
      console.log({statOfUser})
      if (statOfUser) {
        res.status(201).json({ statistic: statOfUser });
      } else {
        res.status(500).json({message: 'Статистика не найдена'});
      }
    } catch (error) {
      console.error('Ошибка при получении статистики: ', error);
      res.status(500).json({message: 'Ошибка сервера'});
    } finally {
      await client.close();
    }
  }


  async updatePlayersStatistic(game) {

    const isEnd = game.end !== null
    if(!isEnd){
      console.log("Игра не окончена")
      return
    }

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const statisticCollection = db.collection('statistic');

      const players = game.getPlayers()
      const isMafiaWin = game.end === Game.MAFIA_WIN
      for (const player of players) {
        const role = player.getRole()
        const isPlayerMafia = role === Onside.CARD_MAFIA
        const isPlayerDet = role === Onside.CARD_DETECTIVE
        const isPlayerDoc = role === Onside.CARD_DOCTOR

        const isWin = (isMafiaWin && isPlayerMafia) || (!isMafiaWin && !isPlayerMafia)
        const newStat = await statisticCollection.updateOne({player: new ObjectId(player.getID())}, {
          $inc: {
            games: 1,
            win: isWin ? 1 : 0,
            gamesMafia: isPlayerMafia ? 1 : 0,
            gamesDoc: isPlayerDoc ? 1 : 0,
            gamesDet: isPlayerDet ? 1 : 0,
            winMafia: isMafiaWin && isPlayerMafia ? 1 : 0,
            winDoc: !isMafiaWin && isPlayerDoc ? 1 : 0,
            winDet: !isMafiaWin && isPlayerDet ? 1 : 0
          }
        })
        console.log({newStat})
      }
    } catch (error) {
      console.error('Ошибка при обновлении статистики: ', error);
    } finally {
      await client.close();
    }
  }
}


module.exports = new StatisticController()