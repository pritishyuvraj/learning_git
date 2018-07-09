'use strict';

let localPeerConnection;

localPeerConnection = new RTCPeerConnection(servers);
localPeerConnection.addEventListener('icecandidate', handleConnections);
localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

// Alice calls getUserMedia()
const mediaStreamConstraints = {
    video: true,
}

function gotLocalMediaStream(stream){
    localVideo.srcObject = stream;
    localStream = stream; 
    trace ("Received local stream. ");
    console.log("received local stream");
    // Enable call button
    callButton.disabled = false;
}

function gotErrorInLocalMediaStream(error){
    console.log("Error in loading local stream", error);
}

navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
.then(gotLocalMediaStream)
.error(gotErrorInLocalMediaStream);

// When Bob recieves message from Alice 
function handleConnections(event){
    const peerConnection = event.target;
    const iceCandiate = event.candidate;

    if(iceCandiate){
        const newIceCandidate = new RTCIceCandidate(iceCandiate);
        const otherPeer = getOtherPeer(peerConnection);
        
        otherPeer.addIceCandidate(newIceCandidate)
        .then( () =>{
            handleConnectionSuccess(peerConnection);
        }).catch( (error) => {
            handleConnectionFailure(peerConnection, error);
        });

        trace('${getPeerName(peerConnection)} ICE Candidate:\n' +
            '${event.candidate.candidate}.');
    }
}

// Exchange of audio and video information
trace('localPeerConnection createOffer start.');
localPeerConnection.createOffer(offerOptions)
.then(createOffer)
.catch(setSessionsDescriptionError);
// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
    trace(`Offer from localPeerConnection:\n${description.sdp}`);
  
    trace('localPeerConnection setLocalDescription start.');
    localPeerConnection.setLocalDescription(description)
      .then(() => {
        setLocalDescriptionSuccess(localPeerConnection);
      }).catch(setSessionDescriptionError);
  
    trace('remotePeerConnection setRemoteDescription start.');
    remotePeerConnection.setRemoteDescription(description)
      .then(() => {
        setRemoteDescriptionSuccess(remotePeerConnection);
      }).catch(setSessionDescriptionError);
  
    trace('remotePeerConnection createAnswer start.');
    remotePeerConnection.createAnswer()
      .then(createdAnswer)
      .catch(setSessionDescriptionError);
  }
  
  // Logs answer to offer creation and sets peer connection session descriptions.
  function createdAnswer(description) {
    trace(`Answer from remotePeerConnection:\n${description.sdp}.`);
  
    trace('remotePeerConnection setLocalDescription start.');
    remotePeerConnection.setLocalDescription(description)
      .then(() => {
        setLocalDescriptionSuccess(remotePeerConnection);
      }).catch(setSessionDescriptionError);
  
    trace('localPeerConnection setRemoteDescription start.');
    localPeerConnection.setRemoteDescription(description)
      .then(() => {
        setRemoteDescriptionSuccess(localPeerConnection);
      }).catch(setSessionDescriptionError);
  }
