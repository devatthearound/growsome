router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // 데이터베이스에 저장
    await db.collection('registrations').insertOne({
      name,
      email,
      registeredAt: new Date()
    });

    res.status(200).json({ message: 'Successfully registered' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
}); 