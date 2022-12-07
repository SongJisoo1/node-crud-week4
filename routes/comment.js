const express = require('express');

const auth = require('../middleware/auth.js');

const { Comment } = require('../models');

const router = express.Router();

//댓글 생성 
router.post('/:postId', auth, async (req, res) => {
    const { nickname, userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;

    if(!comment || Object.keys(req.body).length !== 1) {
        return res.status(400).json({ 'message': '데이터 형식이 올바르지 않습니다.'});
    } 

    await Comment.create({ userId, postId, nickname, comment });

    return res.status(201).json({ 'message': '댓글을 생성하였습니다.' });

});

//댓글 조회
router.get('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;

    const commentList = await Comment.findAll({
        attributes: { exclude: [ 'postId' ]},
        where: { postId },
        order: [['createdAt', 'DESC']]
    });

    console.log(commentList);

    return res.json({'data': commentList});
});

//댓글 수정
router.put('/:commentId', auth, async (req, res) => {
    const { comment } = req.body;
    const { commentId } = req.params;
    const { nickname, userId } = res.locals.user;

    if(!comment || Object.keys(req.body).length !== 1) {
        return res.status(412).json({'errorMessage': '데이터 형식이 올바르지 않습니다.'});
    }

    const existComment = await Comment.findOne({ where: { commentId }});

    if(!existComment) {
        res.status(404).json({'errorMessage': '댓글이 존재하지 않습니다.'});
        return;
    }

    const updatedComment = await Comment.update(
        {comment},
        {where: {userId, commentId}}
    );

    if(updatedComment < 1) {
        res.status(401).json({
            'errorMessage': '댓글이 정상적으로 수정되지 않았습니다.'
        })
        return;
    }

    return res.status(200).json({'message': '댓글을 성공적으로 수정하였습니다.'});
   

}); 

// 댓글 삭제
router.delete('/:commentId', auth, async (req, res) => {
    const { commentId } = req.params;
    const { nickname, userId } = res.locals.user;
    
    try {       
        
        const targetComment = await Comment.findOne({ where: {userId, commentId}});
        
        console.log(targetComment);
        
        if(!targetComment) {
            res.status(404).json({'errorMessage': '댓글이 존재하지 않습니다.'});
            return;
        }

        const deletedComment = await Comment.destroy({
            where: { commentId ,userId }
        });

        if(deletedComment < 1) {
            res.status(401).json({
                'errorMessage': '댓글이 정상적으로 삭제되지 않았습니다.'
            })
            return;
        }

        res.status(200).json({'message': '댓글을 삭제하였습니다.'});
    
    } catch (err) {

        return res.status(400).json({'message': '데이터 형식이 올바르지 않습니다.'});

    }    

});

module.exports = router;