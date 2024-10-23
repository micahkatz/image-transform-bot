import cloudinary from 'cloudinary';
export function getEffect(effect) {
    switch (effect) {
        case 'invert':
            return { effect: 'negate' };
        case 'nuke':
            return { transformation: 'nuke' };
        case 'deepfry':
            return { transformation: 'deepfry' };
        case 'wide':
            return { transformation: 'wide' };
        case 'pixelate':
            return { transformation: 'pixelate' };
        case 'paint':
            return { transformation: 'paint' };
        case 'bw':
            return { transformation: 'bw' };
        case 'grey':
            return { transformation: 'grey' };
        case 'ultranuke':
            return { transformation: 'ultranuke' };
        case 'ultradeepfry':
            return { transformation: 'ultradeepfry' };
        case 'ai-expand':
            return { transformation: 'ai-expand' };
        case 'ai-restore':
            return { effect: 'gen_restore' };
        default:
            return null;
    }
}

export function deleteImg(public_id) {
    cloudinary.v2.uploader.destroy(public_id);
}

export function uploadImage(url, options, callback) {
    console.log('uploading image', url, options);

    cloudinary.v2.uploader.upload(url, function (error, result) {
        console.log('cloudinary finished', result, error);
        const { public_id, url } = result;
        console.log({ public_id, url });

        // const outputUrl = cloudinary.url(public_id, { transformation: "deepfry" });
        const outputUrl = cloudinary.v2.url(public_id, options);

        console.log({ outputUrl });
        callback(outputUrl, public_id);
    });
}

export function getAllAttachments(message) {
    if (!message.attachments) return [];
    var allAttachments = [];

    message.attachments.forEach((a) =>
        allAttachments.push({ url: a.url, authorId: message.author.id })
    );

    return allAttachments;
}
