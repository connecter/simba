
var config = {
    hosts: {
        domain: 'guest.jit.si',
//        domain: 'lambada.jitsi.net',
        //anonymousdomain: 'guest.example.com',
        muc: 'meet.jit.si', // FIXME: use XEP-0030
        bridge: 'jitsi-videobridge.lambada.jitsi.net', // FIXME: use XEP-0030
        //call_control: 'callcontrol.lambada.jitsi.net',
        focus: 'focus.lambada.jitsi.net',
    },
//  getroomnode: function (path) { return 'someprefixpossiblybasedonpath'; },
    useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server
    useIPv6: true, // ipv6 support. use at your own risk
    useNicks: false,
    bosh: 'wss://meet.jit.si/xmpp-websocket', // FIXME: use xep-0156 for that
    etherpad_base: 'https://meet.jit.si/etherpad/p/',
    clientNode: 'http://jitsi.org/jitsimeet', // The name of client node advertised in XEP-0115 'c' stanza
    //defaultSipNumber: '', // Default SIP number
    desktopSharing: 'ext', // Desktop sharing method. Can be set to 'ext', 'webrtc' or false to disable.
    chromeExtensionId: 'jjciemdpijjajiehmfknimmaahgpkpej', // Id of desktop streamer Chrome extension
    desktopSharingSources: ['screen', 'window'],
    minChromeExtVersion: '0.1.5', // Required version of Chrome extension
    enableRtpStats: false, // Enables RTP stats processing
    openSctp: true, // Toggle to enable/disable SCTP channels
    channelLastN: -1, // The default value of the channel attribute last-n.
    adaptiveLastN: false,
    useRtcpMux: true,
    useBundle: true,
    enableRecording: false,
    enableWelcomePage: false,
    enableSimulcast: false,
    isBrand: false
};

module.exports = config
