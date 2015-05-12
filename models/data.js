module.exports = {
    users: [
        {
            id:             '1337',
            username:       'geoff',
            password:       'testpassword'
        }
    ],
    clients: [
        {
            id:             'testId',
            name:           'Test Browser',
            secret:         'Test Secret',
            redirectUri:    'http://localhost:3000/'
        },
        {
            id:             'client2.id',
            name:           'client2.name',
            secret:         'client2.Secret',
            redirectUri:    'http://example.org/oauth2'
        }
    ],
    codes: [],
    accessTokens: [],
    refreshTokens: []
};