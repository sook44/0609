const express = require('express');
const router = express.Router();
const db = require('../models');


router.get


// 1. 전체 유저 목록 조회 (GET /users)
router.get('/users', async (req, res) => {
  try {
    const users = await db.User.findAll(); // 모든 User 레코드 조회
    res.json(users);
  } catch (error) {
    console.error('모든 사용자 조회 실패:', error);
    res.status(500).json({ error: '서버 오류: 사용자 조회 실패' });
  }
});


// 2. 특정 유저 조회 (GET /users/:id)
router.get('/users/:id', async (req, res) => {
  try {
    // req.params.id를 사용하여 URL 파라미터에서 ID 추출
    const user = await db.User.findByPk(req.params.id); // Primary Key(ID)로 사용자 조회
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error(`ID ${req.params.id} 사용자 조회 실패:`, error);
    res.status(500).json({ error: '서버 오류: 사용자 조회 실패' });
  }
});

// 3. 새로운 유저 생성 (POST /users)
router.post('/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // 필수 항목 유효성 검사
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, email은 필수 항목입니다.' });
  }
	// 이메일 중복 처리 필요!
  try {
    const newUser = await db.User.create({ firstName, lastName, email });
    res.status(201).json(newUser); 
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: '이미 존재하는 이메일입니다.' }); // 409 Conflict
    }
    res.status(500).json({ error: '서버 오류: 사용자 생성 실패' });
  }
});

// 4. 유저 정보 수정 (PUT /users/:id)
router.put('/users/:id', async (req, res) => {
  const { firstName, lastName, email } = req.body; // 수정할 데이터
  const userId = req.params.id; // 수정할 사용자 ID

  try {
    // 해당 ID의 사용자 찾기
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '해당 사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보 업데이트
    await user.update({
      firstName: firstName || user.firstName, // 값이 없으면 기존 값 유지
      lastName: lastName || user.lastName,
      email: email || user.email
    });

    res.json(user); // 업데이트된 사용자 정보 반환
  } catch (error) {
    console.error(`ID ${userId} 사용자 업데이트 실패:`, error);
    res.status(500).json({ error: '서버 오류: 사용자 업데이트 실패' });
  }
});

// 5. 유저 삭제 (DELETE /users/:id)
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id; // 삭제할 사용자 ID

  try {
    const deletedRowCount = await db.User.destroy({
      where: { id: userId }
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없거나 이미 삭제되었습니다.' });
    }

    res.status(204).send(); // 204 No Content 응답 (성공적으로 삭제되었으나 응답 본문 없음)
  } catch (error) {
    console.error(`ID ${userId} 사용자 삭제 실패:`, error);
    res.status(500).json({ error: '서버 오류: 사용자 삭제 실패' });
  }
});

// 6. 특정 유저의 게시글 조회 (GET /users/:id/posts)
router.get('/users/:id/posts', async (req, res) => {
  try {
    const userId = req.params.id;

    // 사용자와 해당 사용자의 게시글을 함께 조회
    const user = await db.User.findByPk(userId, {
      include: {
        model: db.Post,
        attributes: ['id', 'title', 'content', 'createdAt'],
      },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 게시글만 반환
    res.json(user.Posts);
  } catch (error) {
    console.error(`ID ${req.params.id} 사용자 게시글 조회 실패:`, error);
    res.status(500).json({ error: '서버 오류: 사용자 게시글 조회 실패' });
  }
});



