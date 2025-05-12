TRANSLATION_RESPONSES = {
    "character": [
        {"text": "X-I-N C-H-À-O", "confidence": 0.95},
        {"text": "C-Ả-M Ơ-N", "confidence": 0.92},
        {"text": "T-Ạ-M B-I-Ệ-T", "confidence": 0.88},
        {"text": "K-H-Ỏ-E K-H-Ô-N-G", "confidence": 0.85},
        {"text": "T-Ô-I T-Ê-N L-À", "confidence": 0.91},
    ],
    "word": [
        {"text": "Xin chào", "confidence": 0.95},
        {"text": "Cảm ơn bạn", "confidence": 0.92},
        {"text": "Tạm biệt nhé", "confidence": 0.88},
        {"text": "Bạn khỏe không", "confidence": 0.85},
        {"text": "Tôi tên là John", "confidence": 0.91},
    ],
    "sentence": [
        {"text": "Xin chào, tôi rất vui được gặp bạn.", "confidence": 0.95},
        {"text": "Cảm ơn bạn rất nhiều vì đã giúp đỡ tôi.", "confidence": 0.92},
        {"text": "Tạm biệt và hẹn gặp lại bạn sau.", "confidence": 0.88},
        {"text": "Hôm nay bạn khỏe không? Tôi hy vọng bạn có một ngày tốt lành.", "confidence": 0.85},
        {"text": "Tôi tên là John và tôi đang học ngôn ngữ ký hiệu.", "confidence": 0.91},
    ]
}

DICTIONARY_ITEMS = [
    {
        "id": 1,
        "word": "Xin chào",
        "category": "Chào hỏi",
        "description": "Cử chỉ chào hỏi cơ bản, thường dùng khi gặp ai đó",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Chào", "Hi"],
        "examples": [
            "Xin chào, tôi tên là Lan",
            "Xin chào, rất vui được gặp bạn"
        ]
    },
    {
        "id": 2,
        "word": "Cảm ơn",
        "category": "Chào hỏi",
        "description": "Cử chỉ thể hiện lòng biết ơn",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Cám ơn", "Biết ơn"],
        "examples": [
            "Cảm ơn bạn rất nhiều",
            "Cảm ơn vì đã giúp đỡ"
        ]
    },
     {
        "id": 3,
        "word": "A",
        "category": "Chữ cái",
        "description": "Chữ A",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Cám ơn", "Biết ơn"], # This seems like a copy-paste error from the original, will keep as is for now.
        "examples": [
            "An ăn cơm chưa",
            "Cảm ơn vì đã giúp đỡ" # This also seems out of place for "A"
        ]
    },
] 