var itemdata = require('../data/item');

let itemsModel = (items) => (
    items.map(item => itemModel(item))
);

let itemModel = (item) => (
    {
        _id: item._id,
        name: item.name,
        emoji: emojiByItemName(itemdata, item.name)
    }
);

let emojiByItemName = (itemdata, name) => {
    let itemDataEmoji = itemdata.items.find(itemm => itemm.name.toLowerCase() === name.toLowerCase());
    return itemDataEmoji ? itemDataEmoji.emoji : null;
}

module.exports = {
    emojiByItemName,
    itemModel
};