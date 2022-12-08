const express = require('express');
const { Like } = require('../models');

const router = express.Router();

const auth = require('../middleware/auth');

// 좋아요 게시글 조회
router.get('/like', auth, async (req, res) => {
    const { nickname, userId } = res.locals.user;

    try {
        const like = await Like.findAll({
            where: { userId },
            attributes: [ 'postId', 'userId', 'nickname' ],
            include: [ Post ],
        });

        if(!like) {
            throw err;
        }

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
    } catch(err) {
        return res.status(400).json({'errorMessage': '좋아요 게시글 조회에 실패하였습니다.'})
    }
});

// 게시물 좋아요
router.put('/:postId/like', auth, async (req, res) => {
    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;

    try {

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
    
    } catch (err) {
        return res.status(400).json({'errorMessage': '게시글 좋아요에 실패하였습니다.'});
    }

});

module.exports = router;