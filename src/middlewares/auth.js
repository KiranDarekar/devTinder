const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const authorization = token === 'xyz';
    if(!authorization){
        res.status(401).send('authorization fail');
    } else {
        console.log('authorization successful...');
        next();
    }
    
}


const userAuth = (req, res, next) => {
    const token = 'xyz2';
    const authorization = token === 'xyz';
    if(!authorization){
        res.status(401).send('authorization fail');
    } else {
        console.log('authorization successful...');
        next();
    }
    
}

module.exports = {
    adminAuth,
    userAuth
}