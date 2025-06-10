const express = require('express');
const router = express.Router();
const db = require('../models');

// 1. 전체 게시글 조회 (GET /posts)
router.get('/post', async (req, res) => {
  try {
    const posts = await db.Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('전체 게시글 조회 실패:', error);
    res.status(500).json({ error: '서버 오류: 사용자 조회 실패' });
  }
});

// 2. 특정 게시글 조회 (GET /posts/:id)
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await db.Post.findByPk(req.params.id, {
      attributes: ['id', 'title', 'content', 'userId'],
    });
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.json(post);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 3. 게시글 생성 (POST /posts)
router.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({ error: 'title, content, userId는 필수 항목입니다.' });
    }
    const newPost = await db.Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 4. 게시글 수정 (PUT /posts/:id)
router.put('/posts/:id', async (req, res) => {
  try {
    const post = await db.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다.' });

    const { title, content } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 5. 게시글 삭제 (DELETE /posts/:id)
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await db.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    await post.destroy();
    res.json({ message: 'deleted' });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
