import { Token } from 'utils/token.js'

App({
    onLaunch(){
        var token = new Token();
        token.getTokenFromServer();
    }
})