const db = require('../config/db');

(async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ MySQL connection established successfully.');
    } catch (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
    }
})();

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}