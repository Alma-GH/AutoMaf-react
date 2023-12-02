const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {MongoClient, ServerApiVersion} = require("mongodb");

const generateToken = (userId) => {
    const payload = {userId}
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
}

const client = new MongoClient(process.env.MONGO_DB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

class AuthController {
    async registration(req, res) {
        const {username, password} = req.body;
        console.log({body: req.body})

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const usersCollection = db.collection('users');

            const existingUser = await usersCollection.findOne({username});
            console.log({existingUser})

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = {username, password: hashedPassword};
                const insertResult = await usersCollection.insertOne(newUser);
                console.log({insertResult})
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
        console.log({body: req.body})

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({username});
            console.log({user})

            if (user && await bcrypt.compare(password, user.password)) {
                const token = generateToken(user._id);
                res.json({accessToken: token, message: 'Аутентификация успешна'});
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