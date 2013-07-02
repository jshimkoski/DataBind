(function () {

    // Setting to window to allow console access for testing.
    var model = window.model = new DataBind({
        'test': 'test',
        'test2': 'test2',
        'test3': ['item1', 'item2', 'item3'],
        'sel': 'Hello',
        'selList': ['Hello', 'Dolly']
    });

})();