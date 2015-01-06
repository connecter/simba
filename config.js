var config = {
    hosts: {
        domain: 'connecter.io',
        //anonymousdomain: 'guest.example.com',
        muc: 'conference.connecter.io', // FIXME: use XEP-0030
        bridge: 'videobridge.connecter.io', // FIXME: use XEP-0030
        //jirecon: 'jirecon.connecter.io',
        //call_control: 'callcontrol.connecter.io',
        focus: 'focus.connecter.io'
    },
//  getroomnode: function (path) { return 'someprefixpossiblybasedonpath'; },
//  useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server
//  useIPv6: true, // ipv6 support. use at your own risk
    useNicks: false,
    bosh: '/http-bind/', // FIXME: use xep-0156 for that
    clientNode: 'http://jitsi.org/jitsimeet', // The name of client node advertised in XEP-0115 'c' stanza
    //focusUserJid: 'focus@auth.connecter.io', // The real JID of focus participant - can be overridden here
    //defaultSipNumber: '', // Default SIP number
    desktopSharing: 'ext', // Desktop sharing method. Can be set to 'ext', 'webrtc' or false to disable.
    chromeExtensionId: 'diibjkoicjeejcmhdnailmkgecihlobk', // Id of desktop streamer Chrome extension
    desktopSharingSources: ['screen', 'window'],
    minChromeExtVersion: '0.1', // Required version of Chrome extension
    enableRtpStats: true, // Enables RTP stats processing
    openSctp: true, // Toggle to enable/disable SCTP channels
    channelLastN: -1, // The default value of the channel attribute last-n.
    adaptiveLastN: false,
    adaptiveSimulcast: false,
    useRtcpMux: true,
    useBundle: true,
    enableRecording: false,
    enableWelcomePage: true,
    enableSimulcast: false,
    enableFirefoxSupport: false, //firefox support is still experimental, only one-to-one conferences with chrome focus
    // will work when simulcast, bundle, mux, lastN and SCTP are disabled.
    logStats: false // Enable logging of PeerConnection stats via the focus
};
