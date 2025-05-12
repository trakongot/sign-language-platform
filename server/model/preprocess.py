import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # Convert BGR (OpenCV default) to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frames.append(frame_rgb)
    cap.release()
    return np.array(frames)


hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    # min_tracking_confidence=0.5,
    # min_detection_confidence=0.5,
)


def get_hand_landmarks(frame, filtered_hand_indices, verbose=False):
    n = len(filtered_hand_indices)
    all_landmarks = np.zeros((2 * n, 3), dtype=np.float32)
    results = hands.process(frame)
    if results.multi_hand_landmarks:
        for lm_set, handness in zip(results.multi_hand_landmarks,
                                    results.multi_handedness):
            pts = np.array(
                [(lm.x, lm.y, lm.z) for lm in lm_set.landmark]
            )[filtered_hand_indices]

            label = handness.classification[0].label  # 'Left' or 'Right'
            if label == 'Left':
                all_landmarks[0:n] = pts
                if verbose:
                    print(f"Found {n} left-hand landmarks.")
            else:
                all_landmarks[n:2*n] = pts
                if verbose:
                    print(f"Found {n} right-hand landmarks.")
    return all_landmarks
