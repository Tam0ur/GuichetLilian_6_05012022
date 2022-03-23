const multer = require('multer');

const MIME_TYPES = {//types de fichiers d'images
    'images.jpg': 'jpg',
    'images/jpeg': 'jpeg',
    'images/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {//enregistrer les fichiers dans le dossier 'images'
        callback(null, 'images')
    },
    filename: (req, file, callback) => {//utiliser le nom do'irigine, remplacer les espace par des underscores + ajout date
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');//exportation du multer, avec la constante storage + gestions unique des téléchargement de fichiers image