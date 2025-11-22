export const rtcConfig = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
}

export class PeerConnection {
    peer: RTCPeerConnection
    dataChannel: RTCDataChannel | null = null

    constructor(onIceCandidate: (candidate: RTCIceCandidate) => void) {
        this.peer = new RTCPeerConnection(rtcConfig)
        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
                onIceCandidate(event.candidate)
            }
        }
    }

    createDataChannel(label: string, onMessage: (data: any) => void, onOpen: () => void) {
        this.dataChannel = this.peer.createDataChannel(label)
        this.dataChannel.onmessage = (event) => onMessage(event.data)
        this.dataChannel.onopen = onOpen
    }

    setDataChannel(channel: RTCDataChannel, onMessage: (data: any) => void, onOpen: () => void) {
        this.dataChannel = channel
        this.dataChannel.onmessage = (event) => onMessage(event.data)
        this.dataChannel.onopen = onOpen
    }

    async createOffer() {
        const offer = await this.peer.createOffer()
        await this.peer.setLocalDescription(offer)
        return offer
    }

    async createAnswer(offer: RTCSessionDescriptionInit) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await this.peer.createAnswer()
        await this.peer.setLocalDescription(answer)
        return answer
    }

    async setRemoteDescription(desc: RTCSessionDescriptionInit) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(desc))
    }

    async addIceCandidate(candidate: RTCIceCandidateInit) {
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate))
    }

    send(data: any) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            this.dataChannel.send(data)
        }
    }

    close() {
        this.dataChannel?.close()
        this.peer.close()
    }
}
