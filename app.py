import av
import cv2
import numpy as np
import streamlit as st
from tensorflow.keras.models import load_model
from streamlit_webrtc import webrtc_streamer, RTCConfiguration

# ---------------------------------------------------------
# PAGE CONFIG
# ---------------------------------------------------------
st.set_page_config(page_title="Facial Emotion Detection", page_icon="🙂", layout="centered")

# ---------------------------------------------------------
# CLASS LABELS & COLORS
# ---------------------------------------------------------
emotion_labels = ['Angry', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

emotion_colors = {
    "Angry": (0, 0, 255),        # Red
    "Fear": (255, 0, 255),       # Magenta
    "Happy": (0, 255, 0),        # Bright Green
    "Neutral": (255, 165, 0),    # Orange
    "Sad": (255, 100, 0),        # Blue-Orange
    "Surprise": (0, 0, 0),       # Black
}

# ---------------------------------------------------------
# LOAD MODEL & CASCADES (Cached)
# ---------------------------------------------------------
@st.cache_resource
def get_model():
    return load_model("emotion_model.keras")

@st.cache_resource
def get_face_cascade():
    return cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

model = get_model()
face_cascade = get_face_cascade()

# ---------------------------------------------------------
# PREDICTION & ANNOTATION LOGIC
# ---------------------------------------------------------
def predict_emotion(face_img):
    face = cv2.resize(face_img, (48, 48))
    face = face.astype("float32") / 255.0
    face = np.expand_dims(face, axis=-1)
    face = np.expand_dims(face, axis=0)

    prediction = model.predict(face, verbose=0)[0]
    idx = np.argmax(prediction)
    confidence = prediction[idx] * 100
    return confidence, idx

def annotate_frame(img_bgr):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
    )

    for (x, y, w, h) in faces:
        face_gray = gray[y:y + h, x:x + w]
        confidence, idx = predict_emotion(face_gray)
        label = emotion_labels[idx]
        color = emotion_colors[label]

        # Draw Rectangle and Label
        cv2.rectangle(img_bgr, (x, y), (x + w, y + h), color, 3)
        text = f"{label} ({confidence:.1f}%)"
        (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
        cv2.rectangle(img_bgr, (x, y - 35), (x + tw + 10, y), color, -1)
        cv2.putText(img_bgr, text, (x + 5, y - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.7, (255, 255, 255), 2)

    cv2.putText(img_bgr, f"Faces: {len(faces)}", (20, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    return img_bgr

# ---------------------------------------------------------
# VIDEO CALLBACK
# ---------------------------------------------------------
def video_frame_callback(frame: av.VideoFrame) -> av.VideoFrame:
    img = frame.to_ndarray(format="bgr24")
    img = annotate_frame(img)
    return av.VideoFrame.from_ndarray(img, format="bgr24")

# ---------------------------------------------------------
# UI
# ---------------------------------------------------------
st.title("🙂 Facial Emotion Detection")
st.write("Detects faces and predicts emotion in real time.")

# Main screen input selection
mode = st.radio("Choose input mode", ["Live Webcam", "Upload Image"], horizontal=True)

if mode == "Live Webcam":
    st.info("Click **START** and allow camera access.")
    webrtc_streamer(
        key="emotion-detection",
        video_frame_callback=video_frame_callback,
        rtc_configuration=RTCConfiguration(
            {"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]}
        ),
        media_stream_constraints={"video": True, "audio": False},
        async_processing=True,
    )

else:
    uploaded_file = st.file_uploader("Upload a photo", type=["jpg", "jpeg", "png"])
    if uploaded_file is not None:
        file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
        img_bgr = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        annotated = annotate_frame(img_bgr.copy())
        st.image(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB),
                 caption="Detected emotions", use_container_width=True)

# ---------------------------------------------------------
# FOOTER
# ---------------------------------------------------------
st.markdown("---")
st.markdown(
    """
    <div style="text-align: center;">
        <p>Built by <b>Bharat Solanki</b> | 🇮🇳 Made in Bharat</p>
    </div>
    """, 
    unsafe_allow_html=True
)