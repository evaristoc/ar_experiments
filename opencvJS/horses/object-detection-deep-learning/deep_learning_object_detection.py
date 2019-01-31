# USAGE
# python deep_learning_object_detection.py --image images/example_01.jpg \
#	--prototxt MobileNetSSD_deploy.prototxt.txt --model MobileNetSSD_deploy.caffemodel

# import the necessary packages
import numpy as np
import argparse
import cv2
from matplotlib import pyplot as plt
#import pathlib
from os import path
import asyncio #different for 3.5-3.6!! Easier for 3.7, with decorators

#https://docs.opencv.org/3.0-beta/doc/py_tutorials/py_gui/py_video_display/py_video_display.html
#https://www.learnopencv.com/how-to-find-frame-rate-or-frames-per-second-fps-in-opencv-python-cpp/

vidcap = cv2.VideoCapture("images/Meet The Horses!.mp4")
fps = int(vidcap.get(cv2.CAP_PROP_FPS))
fcount = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
vidcap.set(cv2.CAP_PROP_POS_FRAMES, 1500)
count = 0
print(fps)

def test(f):
    data = f
    cv2.imwrite("images/videos/meethorses1_"+str(data[1])+".jpg", data[0])

frames = []

while(True):
    # Capture frame-by-frame
    
    
    if count > 250*fps:
        break
    
    ret, frame = vidcap.read()
    
    if ret:
        # Our operations on the frame come here
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if count%(5*fps) == 0 :
            frames.append((frame,count))
        count += 1
        # Display the resulting frame
        cv2.imshow('frame',frame)
    else:
        break
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
vidcap.release()
cv2.destroyAllWindows()

# saveframes = [test(f) for f in frames]
# loop = asyncio.get_event_loop()
# loop.run_until_complete(asyncio.wait(saveframes))
# loop.close()
ap = argparse.ArgumentParser()
ap.add_argument("-p", "--prototxt", required=True,
	help="path to Caffe 'deploy' prototxt file")
ap.add_argument("-m", "--model", required=True,
	help="path to Caffe pre-trained model")
ap.add_argument("-c", "--confidence", type=float, default=0.6,
	help="minimum probability to filter weak detections")
args = vars(ap.parse_args())

def classifier(image, i, args):
    # initialize the list of class labels MobileNet SSD was trained to
    # detect, then generate a set of bounding box colors for each class
    cv2.imshow("horse?", image)
    cv2.waitKey(0)
    cv2.destroyWindow("horse?")
    CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
        "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
        "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
        "sofa", "train", "tvmonitor"]
    COLORS = np.random.uniform(0, 255, size=(len(CLASSES), 3))
    
    # load our serialized model from disk
    print("[INFO] loading model of frame ", i)
    net = cv2.dnn.readNetFromCaffe(args["prototxt"], args["model"])
    
    # load the input image and construct an input blob for the image
    # by resizing to a fixed 300x300 pixels and then normalizing it
    # (note: normalization is done via the authors of the MobileNet SSD
    # implementation)
    #image = cv2.imread(img)
    (h, w) = image.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 0.007843, (300, 300), 127.5)
    
    # pass the blob through the network and obtain the detections and
    # predictions
    try:
        print("[INFO] computing object detections of frame ", i)
        net.setInput(blob)
        detections = net.forward()
        print("[INFO] detections were found...")
        horses = []
        # loop over the detections
        for i in np.arange(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with the
            # prediction
            confidence = detections[0, 0, i, 2]
            idx = int(detections[0, 0, i, 1])
            print("[INFO] class and confidence ", CLASSES[idx], confidence)
            #label = "{}: {:.2f}%".format(CLASSES[idx], confidence * 100)
            # filter out weak detections by ensuring the `confidence` is
            # greater than the minimum confidence
            if confidence > args["confidence"] and (CLASSES[idx]=="horse" or CLASSES[idx] == "person"):
                # extract the index of the class label from the `detections`,
                # then compute the (x, y)-coordinates of the bounding box for
                # the object
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                # display the prediction
                #print("[INFO] {}".format(label))
                print("[INFO] horse was detected at:", startX, startY, endX, endY)                
                recth = endX-startX
                rectw = endY-startY
                startX = max(0,int(startX - 0.05*rectw))
                endX = min(int(endX + 0.05*rectw),w)
                startY = max(0,int(startY - 0.05*recth))
                endY = min(int(endY + 0.05*recth),h)
                #print("[INFO] box location:", startX, startY, endX, endY)
                #cv2.rectangle(image, (startX, startY), (endX, endY),
                #    COLORS[idx], 2)
                #y = startY - 15 if startY - 15 > 15 else startY + 15
                #cv2.putText(image, label, (startX, y),
                #    cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)
                label = "{}: {:.2f}%".format(CLASSES[idx], confidence * 100)
                y = startY + 15
                x = startX + 15
                resth, thimg = cv2.threshold(image,127,255,cv2.THRESH_BINARY)
                detectedbox = thimg[startY:endY, startX:endX]
                if resth:
                    #cv2.putText(thimg, label, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)
                    greythimg = cv2.cvtColor(detectedbox, cv2.COLOR_BGR2GRAY)
                    orb = cv2.ORB_create()
                    kp1s, des1s = orb.detectAndCompute(greythimg,None)
                    #cv2.imshow("detect?", greythimg)
                    #cv2.waitKey(0)
                    #cv2.destroyWindow("detect?")
                    #plt.imshow(greythimg)
                    #plt.show()
                    print("[INFO] keypoints calculated...")
                    kpimg = np.ones((greythimg.shape[0], greythimg.shape[1], 1))
                    xp = []
                    yp = []
                    for kp in kp1s:
                        xp.append(kp.pt[0])
                        yp.append(kp.pt[1])
                        #cv2.circle(kpimg, kp.pt, 5, (0,255,0),-1)
                    #kpgreythimg = cv2.drawKeypoints(greythimg, kp1, None, flags=cv2.DRAW_MATCHES_FLAGS_DEFAULT)
                    #cv2.circle(greythimg, (100,100), 50, (0,255,0), -1)
                    print("[INFO] keypoints calculated...")
                    #cv2.imshow("kp", kpimg)
                    #cv2.waitKey(0)
                    #cv2.destroyWindow("kp")                    
                    #horses.append(image[startY:endY, startX:endX])
                    plt.axis([0, max(xp)+15, max(yp)+15, 0])
                    plt.plot(xp, yp, 'bo')
                    plt.annotate(label, xy=(15,15))
                    plt.show()
                    print(max(xp))
    except:
        #raise
        print("[ERROR]")
        raise
    finally:
        return horses
    
    # # show the output image
    # cv2.imshow("Output", image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    # dirname = args["image"].split("/")
    # filename = dirname[1].split(".")
    # print(dirname[0],filename[0]+"_marked."+filename[1])
    # cv2.imwrite(path.join(dirname[0],filename[0]+"_marked."+filename[1]), image)


#for f in frames:
#    cv2.imwrite("images/video_tests/meethorses1_"+str(f[1])+".jpg", f[0])

print("[INFO] all frames ",len(frames))
if len(frames) > 0:
    print("Frames:")
    for i, f in enumerate(frames):
        print(i, f[0])
    print()
    print("=============================================================")
    print()
    for i, f in enumerate(frames):
        f = frames[i]
        print("[INFO] remaining frames ", len(frames) - 1 - i)
        chop_horses = classifier(f[0], i, args)
        print("[INFO] this frame ", i, chop_horses)
        # if chop_persons:
        #     for j, ch in enumerate(chop_persons):
        #         print("[INFO] ch ", j)
        #         cv2.imshow("Output", ch)
        #         cv2.waitKey(1)
        #         cv2.destroyWindow("Output")
        #         if 0xFF == ord('q'):  
        #             break
