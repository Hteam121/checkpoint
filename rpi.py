import cv2
import numpy as np
import time
import logging
import firebase_admin
from firebase_admin import credentials, db
import sys
import os

# Setup logging for debugging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

# Initialize Firebase with your service account credentials
firebase_json_path = '/home/temoc/Desktop/checkpoint/checkpoint-77dd4-firebase-adminsdk-hwb2i-0a9f526192.json'  # Update the path if necessary
if not os.path.isfile(firebase_json_path):
    logger.error(f"Service account JSON file not found at {firebase_json_path}")
    sys.exit(1)

try:
    cred = credentials.Certificate(firebase_json_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://checkpoint-77dd4-default-rtdb.firebaseio.com/'  # Ensure this is your correct Firebase URL
    })
    logger.info("Firebase initialized successfully.")
except Exception as e:
    logger.exception("Failed to initialize Firebase:")
    sys.exit(1)

# Load Haar Cascade face detector
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

if face_cascade.empty():
    logger.error("Error: Could not load Haar Cascade XML file.")
    sys.exit(1)
else:
    logger.info("Haar Cascade XML file loaded successfully.")

# Initialize video capture
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    logger.error("Error: Could not open camera.")
    sys.exit(1)
else:
    logger.info("Video capture initialized successfully.")

# Firebase status and timing variables
firebase_status = False  # Current status in Firebase
true_timestamp = 0  # The time when it was last set to TRUE

# Function to detect green color in a given image and check if it's of sufficient size
def detect_green(image, min_area=2000):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hsv = cv2.GaussianBlur(hsv, (5, 5), 0)

    # Adjusted HSV range for green detection to exclude white
    lower_green = np.array([35, 100, 100])
    upper_green = np.array([85, 255, 255])

    # Threshold the HSV image to get only green colors
    mask = cv2.inRange(hsv, lower_green, upper_green)
    cv2.imshow('Green Mask', mask)  # For debugging

    # Find contours of green areas
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    green_detected = False
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > min_area:
            green_detected = True
            # Optionally draw the contour on the original image
            # cv2.drawContours(image, [cnt], -1, (0, 255, 0), 2)
            break
    return green_detected

# Function to update Firebase with the detection status
def update_firebase(status):
    global firebase_status, true_timestamp
    if firebase_status != status:
        ref = db.reference('detection_status')
        ref.set(status)
        firebase_status = status
        status_str = "TRUE" if status else "FALSE"
        logger.info(f"Updated Firebase: detection_status is {status_str}")
        if status:  # If the status is set to TRUE, record the timestamp
            true_timestamp = time.time()

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            logger.error("Error: Failed to grab frame.")
            break

        # Convert frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Face detection
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        face_detected = False
        green_detected = False

        # Create a copy of the frame for green detection
        frame_for_green = frame.copy()

        for (x, y, w, h) in faces:
            face_detected = True

            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, 'Face', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX,
                        0.5, (0, 255, 0), 2)

            # Exclude face region from green detection by blacking it out
            frame_for_green[y:y + h, x:x + w] = (0, 0, 0)

            # Process only the first detected face
            break

        # Detect green in the rest of the frame (excluding face region)
        green_detected = detect_green(frame_for_green, min_area=2000)  # Adjust min_area as needed

        # Indicate green detection on the frame
        if green_detected:
            cv2.putText(frame, 'Green Detected', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        else:
            cv2.putText(frame, 'No Green Detected', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        # Output the status
        current_status = face_detected and green_detected
        logger.info(f"Detection Status: {'TRUE' if current_status else 'FALSE'}")

        # Update Firebase to TRUE immediately if detection is true
        if current_status:
            update_firebase(True)

        # Keep the status TRUE in Firebase for 5 seconds, then update to FALSE
        if firebase_status and time.time() - true_timestamp >= 5:
            # If 5 seconds have passed, set Firebase status to FALSE
            update_firebase(False)

        # Display the resulting frame
        cv2.imshow('Face and Green Detection', frame)

        # Press 'q' to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            logger.info("Program terminated by user.")
            break

except Exception as e:
    logger.exception("An error occurred during execution:")
finally:
    cap.release()
    cv2.destroyAllWindows()
    logger.info("Released video capture and destroyed all windows.")