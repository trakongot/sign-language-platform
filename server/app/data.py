"""
Dữ liệu giả cho các API Dictionary, Translate và Learn
"""

# Dictionary data
DICTIONARY_CATEGORIES = [
    'Tất cả',
    'Chữ cái',
    'Số',
    'Chào hỏi',
    'Gia đình',
    'Thời gian',
    'Màu sắc',
    'Thực phẩm',
    'Cảm xúc',
    'Câu hỏi',
    'Nơi chốn',
]
# Dictionary data
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
        "word": "Tạm biệt",
        "category": "Chào hỏi",
        "description": "Cử chỉ khi chia tay hoặc tạm biệt ai đó",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Bye", "Gặp lại sau"],
        "examples": [
            "Tạm biệt, hẹn gặp lại",
            "Tạm biệt, mai gặp nhé"
        ]
    },
    {
        "id": 4,
        "word": "Gia đình",
        "category": "Gia đình",
        "description": "Ký hiệu cho từ gia đình",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Nhà", "Family"],
        "examples": [
            "Gia đình tôi có 4 người",
            "Gia đình là điều quan trọng nhất"
        ]
    },
    {
        "id": 5,
        "word": "Bố/Cha",
        "category": "Gia đình",
        "description": "Ký hiệu chỉ người cha trong gia đình",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Ba", "Tía", "Cha"],
        "examples": [
            "Bố tôi đang làm việc",
            "Bố rất thương con"
        ]
    },
    {
        "id": 6,
        "word": "Mẹ",
        "category": "Gia đình",
        "description": "Ký hiệu chỉ người mẹ trong gia đình",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Má", "Mẹ", "Mợ"],
        "examples": [
            "Mẹ tôi rất hiền",
            "Mẹ đang nấu cơm"
        ]
    },
    {
        "id": 7,
        "word": "Vui",
        "category": "Cảm xúc",
        "description": "Ký hiệu thể hiện cảm xúc vui vẻ, hạnh phúc",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Hạnh phúc", "Vui vẻ", "Sung sướng"],
        "examples": [
            "Tôi rất vui khi gặp bạn",
            "Hôm nay tôi thấy vui"
        ]
    },
    {
        "id": 8,
        "word": "Buồn",
        "category": "Cảm xúc",
        "description": "Ký hiệu thể hiện cảm xúc buồn bã",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Không vui", "Chán nản", "Rầu rĩ"],
        "examples": [
            "Tôi cảm thấy buồn",
            "Hôm nay tôi hơi buồn"
        ]
    },
    {
        "id": 9,
        "word": "Giận dữ",
        "category": "Cảm xúc",
        "description": "Ký hiệu thể hiện cảm xúc tức giận",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Tức giận", "Bực tức", "Tức"],
        "examples": [
            "Tôi đang rất giận",
            "Đừng làm tôi giận"
        ]
    },
    {
        "id": 10,
        "word": "Yêu",
        "category": "Cảm xúc",
        "description": "Ký hiệu thể hiện tình yêu thương",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["Thương", "Quý", "Mến"],
        "examples": [
            "Tôi yêu bạn",
            "Tôi yêu gia đình"
        ]
    },
    {
        "id": 11,
        "word": "Một",
        "category": "Số",
        "description": "Ký hiệu cho số 1",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["1", "One"],
        "examples": [
            "Tôi có một chiếc xe",
            "Chỉ cần một lần"
        ]
    },
    {
        "id": 12,
        "word": "Hai",
        "category": "Số",
        "description": "Ký hiệu cho số 2",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": ["2", "Two"],
        "examples": [
            "Tôi có hai người con",
            "Hai ngày nữa"
        ]
    },
    {
        "id": 13,
        "word": "A",
        "category": "Chữ cái",
        "description": "Ký hiệu cho chữ cái A trong bảng chữ cái",
        "videoUrl": "https://www.youtube.com/embed/zG-galehGMs?si=qAUDusvxUctZmxCt",
        "thumbnail": "/placeholder.svg?height=150&width=200",
        "variations": [],
        "examples": [
            "A như trong từ Áo",
            "A như trong từ An"
        ]
    },
]


# Learning data
LEARNING_LESSONS = {
    "beginner": [
        {
            "id": 1,
            "title": "Alphabet Basics",
            "description": "Learn the fundamental hand signs for the alphabet",
            "duration": "30 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Introduction to Sign Language Alphabet",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "5:30"
                },
                {
                    "type": "text",
                    "title": "Understanding Hand Positions",
                    "content": "Hand positioning is crucial for clear sign language communication. Always ensure your hands are visible and your movements are deliberate."
                },
                {
                    "type": "exercise",
                    "title": "Practice A-F",
                    "instructions": "Try to sign each letter from A to F, then record yourself to review your technique.",
                    "items": ["A", "B", "C", "D", "E", "F"]
                }
            ]
        },
        {
            "id": 2,
            "title": "Common Greetings",
            "description": "Master everyday greetings and introductions",
            "duration": "45 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Basic Greetings in Sign Language",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "6:15"
                },
                {
                    "type": "text",
                    "title": "Cultural Context of Greetings",
                    "content": "Greetings in sign language often include facial expressions that convey warmth and openness. Remember to smile and maintain eye contact."
                },
                {
                    "type": "exercise",
                    "title": "Practice Greetings",
                    "instructions": "Practice the following greetings and record yourself to check your technique.",
                    "items": ["Hello", "How are you?", "Nice to meet you", "Good morning", "Goodbye"]
                }
            ]
        },
        {
            "id": 3,
            "title": "Numbers & Counting",
            "description": "Learn to sign numbers from 1-20",
            "duration": "35 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Numbers 1-10 in Sign Language",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "4:45"
                },
                {
                    "type": "video",
                    "title": "Numbers 11-20 in Sign Language",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "5:20"
                },
                {
                    "type": "exercise",
                    "title": "Practice Numbers",
                    "instructions": "Practice signing the following numbers and sequences.",
                    "items": ["1-5", "6-10", "11-15", "16-20", "Your age", "Your phone number"]
                }
            ]
        }
    ],
    "intermediate": [
        {
            "id": 4,
            "title": "Everyday Phrases",
            "description": "Common phrases for daily conversations",
            "duration": "50 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Essential Everyday Phrases",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "7:30"
                },
                {
                    "type": "text",
                    "title": "Sentence Structure in Sign Language",
                    "content": "Sign language often follows a different grammatical structure than spoken language. Generally, it uses a time-topic-comment structure rather than subject-verb-object."
                },
                {
                    "type": "exercise",
                    "title": "Practice Common Phrases",
                    "instructions": "Sign these common phrases and try to use them in different contexts.",
                    "items": ["Where is the bathroom?", "I need help", "What time is it?", "I don't understand", "Can you repeat that?"]
                }
            ]
        },
        {
            "id": 5,
            "title": "Emotions & Feelings",
            "description": "Express emotions through sign language",
            "duration": "40 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Expressing Emotions in Sign Language",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "6:50"
                },
                {
                    "type": "text",
                    "title": "The Importance of Facial Expressions",
                    "content": "In sign language, facial expressions are as important as hand movements. They provide grammar and emotional context that is crucial for clear communication."
                },
                {
                    "type": "exercise",
                    "title": "Practice Emotions",
                    "instructions": "Practice signing these emotions with appropriate facial expressions.",
                    "items": ["Happy", "Sad", "Angry", "Surprised", "Confused", "Excited", "Tired"]
                }
            ]
        }
    ],
    "advanced": [
        {
            "id": 6,
            "title": "Complex Conversations",
            "description": "Advanced techniques for fluid conversations",
            "duration": "60 min",
            "progress": 0,
            "image": "/placeholder.svg?height=200&width=350",
            "content": [
                {
                    "type": "video",
                    "title": "Advanced Conversation Techniques",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "duration": "9:15"
                },
                {
                    "type": "text",
                    "title": "Classifiers and Visual Imagery",
                    "content": "At an advanced level, sign language uses classifiers and visual imagery to convey complex ideas. These are handshapes that represent categories of objects or ideas and can be used to describe how objects move or relate to each other."
                },
                {
                    "type": "exercise",
                    "title": "Practice Complex Topics",
                    "instructions": "Try to sign about these more complex topics using classifiers and descriptive techniques.",
                    "items": ["Describe your home layout", "Tell a short story about your day", "Explain how to cook your favorite meal", "Discuss a current event"]
                }
            ]
        }
    ]
}

# Translation response examples
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