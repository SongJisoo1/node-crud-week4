const express = require('express');
const { Post } = require('../models');
const { User } = require('../models');
const { Comment } = require('../models');

const router = express.Router();

const auth = require('../middleware/auth');


// 게시글 작성
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    const { nickname, userId } = res.locals.user;

    try {
        if(Object.keys(req.body).length !== 2 || !title || !content) {
            return res.status(412).json({'errorMessage': '데이터 형식이 올바르지 않습니다.'});
        }

        await Post.create({ userId, nickname, title, content });

        return res.status(201).json({'message': '게시글 작성에 성공하였습니다.'});

    } catch(err) {
        return res.status(201).json({'message': '게시글 작성에 실패하였습니다.'});
    }
});

//전체 게시글 조회
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: { exclude: ['content']},
            order: [['createdAt', 'DESC']]
        });
        
        return res.status(200).json({'data1': posts});
    } catch (err) {
        return res.status(400).json({'errorMessage': '게시글 조회에 실패하였습니다.'});
    }
});

//게시글 상세 조회
router.get('/:postId', auth, async (req, res) => {
    const { postId } = req.params;

    try {
        
        const detail = await Post.findOne({
            where: { postId },
            include: [ Comment ]
        });

        if(!detail) {
            return res.status(404).json({'message': '존재하지 않는 게시물입니다.'});
        }

        return res.status(200).json({ 'data': detail });
    
    } catch (err) {

        return res.status(400).json({'errorMessage': '게시글 조회에 실패하였습니다.'});

    }
});

//게시글 수정
router.put('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { nickname, userId } = res.locals.user;

    try {

        if(Object.keys(req.body).length !== 2 || !title || !content) {
            return res.status(400).json({'errorMessage': '데이터 형식이 올바르지 않습니다.'});
        }

        const { userId } = await User.findOne({
            attributes: ['userId'],
            where: { nickname },
        });

        const updatedPost = await Post.update(
            {title, content},
            {where: {userId, postId}}
        );

        if(updatedPost < 1) {
            res.status(401).json({
                'errorMessage': '게시글이 정상적으로 수정되지 않았습니다.'
            })
            return;
        }

        return res.status(200).json({'message': '게시물을 성공적으로 수정하였습니다.'});
    
    } catch (err) {
    
        return res.status(400).json({'errorMessage': '게시글 수정에 실패아였습니다.'});

    }   

});

// 게시물 삭제 
router.delete('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;
    
    try {       
        
        const targetPost = await Post.findOne({ where: {postId}});
        
        if(!targetPost) {
            res.status(404).json({'errorMessage': '게시물이 존재하지 않습니다.'});
            return;
        }
        
        const { userId } = await User.findOne({
            attributes: ['userId'],
            where: { nickname },
        });

        const deletedPost = await Post.destroy({
            where: { postId ,userId }
        });

        if(deletedPost < 1) {
            res.status(401).json({
                'errorMessage': '게시글이 정상적으로 삭제되지 않았습니다.'
            })
            return;
        }

        res.status(200).json({'message': '게시글을 삭제하였습니다.'});
    
    } catch (err) {

        return res.status(400).json({'errorMessage': '게시글 삭제에 실패하였습니다.'});

    }    

});

module.exports = router;