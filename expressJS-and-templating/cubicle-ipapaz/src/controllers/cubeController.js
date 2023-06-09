const cubeController = require('express').Router();

const Cube = require('../models/Cube');
const Accessory = require('../models/Accessory');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getCubeById, editCubeById, deleteCubeById } = require('../services/cubeService');
const generateDifficultyLevels = require('../util/difficultyLevels');

cubeController.get('/create', isAuthenticated, (req, res) => {
    res.render('create');
});

cubeController.post('/create', isAuthenticated, async (req, res) => {
    const { name, description, imageUrl, difficultyLevel } = req.body;

    const cube = new Cube({
        name,
        description,
        imageUrl,
        difficultyLevel,
        owner: req.user._id
    });

    await cube.save();

    res.redirect('/');
});

cubeController.get('/details/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId;

    if (!cubeId) {
        return res.render('404', {error: 'This cube not exist!'});
    }

    try {
        const cube = await Cube.findById(cubeId).populate('accessories').lean();

        if (!cube) {
            return res.render('404', {error: 'This cube not exist!'});
        }
        
        let isOwner = false

        if(req.user){
            isOwner = cube.owner == req.user._id;
        }

        res.render('details', { cube, isOwner });

    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }

});

cubeController.get('/atach/:cubeId', isAuthenticated, async (req, res) => {
    const cubeId = req.params.cubeId;

    try {
        const cube = await Cube.findById(cubeId).lean();
        const accessories = await Accessory.find({ _id: { $nin: cube.accessories } }).lean();

        if(cube.owner != req.user._id){
            return res.render('404', {error: 'You are not owner to this cube'});
        }

        // ще върне всички аксесоари от базата на които ид-то им не се намира в масива с аксесоари на конкретния елемент
        res.render('atachAccessory', { cube, accessories });

    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

cubeController.post('/atach/:cubeId', isAuthenticated, async (req, res) => {
    try {
        const cube = await Cube.findById(req.params.cubeId);

        if(cube.owner != req.user._id){
            return res.render('404', {error: 'You are not owner to this cube'});
        }
        
        const accessoryId = req.body.accessory;

        cube.accessories.push(accessoryId);

        cube.save();

        res.redirect(`/details/${req.params.cubeId}`);
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }

});

cubeController.get('/edit/:cubeId', isAuthenticated, async (req, res) => {
    try {
        const cube = await getCubeById(req.params.cubeId).lean();

        if(cube.owner != req.user._id){
            return res.render('404', {error: 'You are not owner to this cube'});
        }

        const difficultyLevels = generateDifficultyLevels(cube.difficultyLevel);

        res.render('edit', { cube, difficultyLevels });
    } catch (err) {
        console.log(err.message)
        res.redirect('/404');
    }
})

cubeController.post('/edit/:cubeId', isAuthenticated, async (req, res) => {
    const cubeId = req.params.cubeId;
    const updatedCubeData = req.body;
    

    try {
        const cube = await editCubeById(cubeId, updatedCubeData);
        
        if(cube.owner != req.user._id){
            return res.render('404', {error: 'You are not owner to this cube'});
        }

        res.redirect(`/details/${cubeId}`)
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

cubeController.get('/delete/:cubeId', isAuthenticated, async (req, res) => {
    
    const cube = await getCubeById(req.params.cubeId).lean();

    if(cube.owner != req.user._id){
        return res.render('404', {error: 'You are not owner to this cube'});
    }

    const difficultyLevels = generateDifficultyLevels(cube.difficultyLevel);

    res.render('delete', { cube, difficultyLevels });
});

cubeController.post('/delete/:cubeId', isAuthenticated, async (req, res) => {
    try {
        const cube = await deleteCubeById(req.params.cubeId);

        if(cube.owner != req.user._id){
            return res.render('404', {error: 'You are not owner to this cube'});
        }

        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

module.exports = cubeController;