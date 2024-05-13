const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("./dbClient.js")

const getNewStatistic = (playerId) => {
    return {
        player: playerId,
        games: 0,
        win: 0,
        gamesMafia: 0,
        gamesDoc: 0,
        gamesDet: 0,
        winMafia: 0,
        winDoc: 0,
        winDet: 0
    }
}

const generateToken = (userId) => {
    const payload = {userId}
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
}

class AuthController {
    async registration(req, res) {
        const {username, password} = req.body;

        if(username.length < 3)
            return res.status(400).json({message: 'Короткое имя(мин. 3 символа)'});
        if(password.length < 3)
            return res.status(400).json({message: 'Короткий пароль(мин. 3 символа)'});


        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const usersCollection = db.collection('users');
            const statisticCollection = db.collection('statistic')

            const existingUser = await usersCollection.findOne({username});

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = {username, password: hashedPassword};
                const insertResult = await usersCollection.insertOne(newUser);
                const newStat = getNewStatistic(insertResult.insertedId)
                await statisticCollection.insertOne(newStat)

                const token = generateToken(insertResult.insertedId)
                res.status(201).json({accessToken: token, message: 'Пользователь успешно зарегистрирован'});
            } else {
                res.status(409).json({message: 'Пользователь уже существует'});
            }
        } catch (error) {
            console.error('Ошибка при регистрации: ', error);
            res.status(500).json({message: 'Ошибка сервера'});
        } finally {
            await client.close();
        }

    }

    async login(req, res) {
        const {username, password} = req.body;

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({username});

            if (user && await bcrypt.compare(password, user.password)) {
                const token = generateToken(user._id);
                res.status(201).json({accessToken: token, message: 'Аутентификация успешна'});
            } else {
                res.status(401).json({message: 'Неверные учетные данные'});
            }
        } catch (error) {
            console.error('Ошибка при аутентификации: ', error);
            res.status(500).json({message: 'Ошибка сервера'});
        } finally {
            await client.close();
        }
    }

    me(req, res) {
        const user = req.user
        res.json({ user });
    }
}

module.exports = new AuthController()