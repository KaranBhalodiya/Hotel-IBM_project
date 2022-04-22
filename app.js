const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
var port = process.env.VCAP_APP_PORT || 8080;
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
	tenantId: "70d30e23-3cfe-4254-ac9c-d327ddeb2117",
	clientId: "a8ea0917-af5f-4cec-b456-fdb0cc3be7d7",
	secret: "MWU0NjdmMTMtMDg1Mi00NzIzLTg2OWYtM2Q5ZTAxNGZmMDc5",
	oauthServerUrl: "https://eu-gb.appid.cloud.ibm.com/oauth/v4/70d30e23-3cfe-4254-ac9c-d327ddeb2117",
	redirectUri: "https://loginauthappid.eu-gb.cf.appdomain.cloud/appid/callback"
}));


app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get('/api/user', (req, res) => {
	console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
	res.json({
		user: {
			name: req.user.name
		}
	});
});


app.get('/appid/logout', function(req, res){
	WebAppStrategy.logout(req);
	res.redirect('/');
});

app.use(express.static("./public"));
app.listen(port, () => {
    console.log('Listening on https://loginauthappid.eu-gb.cf.appdomain.cloud/');
});
