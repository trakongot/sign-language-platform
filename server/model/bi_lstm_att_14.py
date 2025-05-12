import torch
import torch.nn as nn
import torch.nn.functional as F

class Attention14(nn.Module):
    def __init__(self, hidden_dim):
        super(Attention14, self).__init__()
        self.attn = nn.Linear(hidden_dim, 1)

    def forward(self, lstm_outputs):
        attn_scores = self.attn(lstm_outputs)  # (batch, seq_len, 1)
        attn_weights = F.softmax(attn_scores, dim=1)  # (batch, seq_len, 1)
        context = torch.sum(lstm_outputs * attn_weights, dim=1)  # (batch, hidden_dim)
        return context, attn_weights

class BiLSTMAttention14(nn.Module):
    def __init__(self, input_size=126, n_lstm_layers=2, hidden_size=128, n_classes=34, dropout_rate=0.25, cls_head=True):
        super(BiLSTMAttention14, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=n_lstm_layers,
            batch_first=True,
            bidirectional=True,
            # dropout=dropout_rate
        )
        self.relu = nn.ReLU()
        lstm_output_dim = hidden_size * 2
        self.attention = Attention14(hidden_dim=lstm_output_dim)
        self.cls_head = cls_head
        if self.cls_head:
            self.bn_context = nn.BatchNorm1d(lstm_output_dim)
            self.dropout_context = nn.Dropout(dropout_rate)
            self.classifier = nn.Sequential(
                nn.Linear(lstm_output_dim, hidden_size),
                nn.ReLU(),
                nn.BatchNorm1d(hidden_size),
                nn.Dropout(dropout_rate),
                nn.Linear(hidden_size, n_classes)
            )

    def forward(self, x):
        batch_size, seq_len, n_landmarks, coords = x.size()
        x = x.view(batch_size, seq_len, n_landmarks * coords)  # (batch, seq_len, 126)
        lstm_out, _ = self.lstm(x)  # (batch, seq_len, hidden_size*2)
        lstm_out = self.relu(lstm_out)
        context, _ = self.attention(lstm_out) # (batch, hidden_size*2)
        if not self.cls_head:
            return context
        context_bn = self.bn_context(context)  # (batch, hidden_size*2)
        context_drop = self.dropout_context(context_bn)  # (batch, hidden_size*2)
        logits = self.classifier(context_drop)
        return logits