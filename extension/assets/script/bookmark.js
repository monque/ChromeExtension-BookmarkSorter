console.info('bookmark.js')


/* ****************************** Sorting ****************************** */
function reorder_tree(eventname) {
    chrome.bookmarks.getTree(function(results) {
        console.info('sort tree begin fired by [' + eventname + ']');

        // Traverse Bookmark Node
        var node, stack = [];
        stack.push(results[0]);
        while (stack.length > 0) {
            node = stack.pop();
            if (!node || !is_folder(node))
                continue;
            stack = stack.concat(node.children);
            BookmarkModel__SortChildren(node);
        }

        console.info('sort tree end');
    });
}


function is_folder(node) {
    return 'children' in node;
}


function is_root(node) {
    return node.id == '0';
}


function comparator(x, y) {
    var x_key = (is_folder(x) ? '0' : '1') + x.title.toLowerCase();
    var y_key = (is_folder(y) ? '0' : '1') + y.title.toLowerCase();
    if (x_key == y_key)
        return 0;
    else if(x_key > y_key)
        return 1;
    else
        return -1;
}


function BookmarkModel__SortChildren(parent) {
    // BookmarkModel::SortChildren re-implement
    // chromium/src/chrome/browser/bookmarks/bookmark_model.cc
    if (!parent || !is_folder(parent) || is_root(parent) ||
            parent.children.length <= 1)
        return;
    parent.children.sort(comparator);
    for (var i in parent.children) {
        var child = parent.children[i];
        if (i == child.index)
            continue;
        chrome.bookmarks.move(child.id, {'index': parseInt(i)});
        console.debug(child.index + ' -> ' + i, child);
    }
}
