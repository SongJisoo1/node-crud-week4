const express = require('express');
const { Post } = require('../models');
const { User } = require('../models');
const { Comment } = require('../models');
const { Like } = require('../models');

const router = express.Router();

const auth = require('../middleware/auth');



// 게시글 작성
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    const { nickname, userId } = res.locals.user;
    

    if(Object.keys(req.body).length !== 2 || !title || !content) {
        return res.status(400).json({'errorMessage': '데이터 형식이 올바르지 않습니다.'});
    }

    await Post.create({ userId, nickname, title, content });

    res.status(201).json({'message': '게시글 작성에 성공하였습니다.'});

    return;
});

//전체 게시글 조회
router.get('/', async (req, res) => {
    const posts = await Post.findAll({
        attributes: { exclude: ['content']},
        order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({'data1': posts});
});

// 좋아요 게시글 조회
router.get('/like', auth, async (req, res) => {
    const { nickname, userId } = res.locals.user;

    console.log(userId);

    const like = await Like.findAll({
        where: { userId },
        attributes: [ 'postId', 'userId', 'nickname' ],
        include: [ Post ],
    });

    const likeList = like.map((v) => {
        return {
            postId: v.postId,
            userId: v.userId,
            nickname: v.nickname,
            title: v.Post.title,
            createdAt: v.Post.createdAt,
            updatedAt: v.Post.updatedAt,
            likes: v.Post.like
        }
    });

    likeList.sort((a, b) => b.likes - a.likes);

    res.status(200).json({ 'data': likeList });

});

//게시글 상세 조회
router.get('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    console.log(res.locals.user);

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

        return res.status(400).json({'message': '데이터 형식이 올바르지 않습니다.'});

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
    
    return res.status(400).json({'message': '데이터 형식이 올바르지 않습니다.'});

    }   

});

// 게시물 삭제 
router.delete('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;
    
    try {       
        
        const targetPost = await Post.findOne({ where: {postId}});
        
        console.log(targetPost);
        
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

        return res.status(400).json({'message': '데이터 형식이 올바르지 않습니다.'});

    }    

});

// 게시물 좋아요
router.put('/:postId/like', auth, async (req, res) => {
    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;

    const existPost = await Post.findOne({ where: { postId } });

    // 게시물이 존재하지 않을 시 
    if(!existPost) {
        res.status(404).json({ 'errorMessage': '게시글이 존재하지 않습니다.'});
        return;
    }

    const [ _, isLike ] = await Like.findOrCreate({
        where: { postId, userId, nickname },
        default: { postId, userId, nickname }
    });

    if(isLike) {
        await Post.increment({like: 1}, { where: {postId}});
        res.status(200).json({'message': '게시글의 좋아요를 등록하였습니다.'});
        return; 
    } else {
        await Post.decrement({like: 1}, { where: {postId}});
        await Like.destroy({where:{postId, userId}});
        res.status(200).json({'message': '게시글의 좋아요를 취소하였습니다.'});
        return;
    }

});

module.exports = router;