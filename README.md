# Imposter Cities Greenscreen

1. Setup Hikvision settings to match images

    Video/Audio Settings
    ![Video/Audio Settings](https://imgur.com/lSvmbeR.png)

    IPv4 Address and Subnet Mask
    ![IPv4 Address and Subnet](https://imgur.com/LRDiRmh.png)
    You don't need to change these settings, but it will be easier for debugging if our addresses match.

    RTSP Port Settings
    ![RTSP Port](https://imgur.com/JSjEpEh.png)
    
    Security Settings
    ![Security Settings](https://imgur.com/eVGNSEx.png)
    
    Add new user
    ![New user](https://i.imgur.com/K1oGpYn.jpg)

2. Test rtsp link is working by entering the URL scheme into your browser (or VLC).
`rtsp://imposter:Iw0rkfrog@10.0.0.15:554/Streaming/Channels/101/httpPreview.asp`

3. Run `cd webcam`. That is our working folder. 

4. Run `npm install` to download all libraries.

5. Run `node index` to start up the server.

6. Navigate to `http://localhost:3000/` and test with greenscreen.







