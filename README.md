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

2. Test rtsp link is working by entering the URL scheme into your browser (or VLC). If you are having problems viewing the RTSP feed download VLC.
`rtsp://imposter:Iw0rkfrog@10.0.0.15:554/Streaming/Channels/101/httpPreview.asp`

3. Run `cd webcam`. That is our working folder. 

4. Run `npm install` to download all libraries.

5. Run `node index` to start up the server.

6. Navigate to `http://localhost:3000/` and test with greenscreen.

You should be seeing 4 videos, the top 3 are the inputs (left is from Hikvision, the other 2 are background videos). The bottom video is the greenscreen effect, with blob detection. There is a number on the top left which indicates # of blobs in the scene. 

## Known issues are:
1) Unstable blob detection. We might switch this out for a better library.
2) Laggy video, this is actively being worked on.







