import { FirestoreTimestamp } from "@/backend/types/firebase"
import React, { useRef } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler"

type PaymentBubbleProps = {
  payment: any
  name: string
  showDateDivider: boolean
  formatDate: (timestamp: FirestoreTimestamp) => string
  formatTime: (timestamp: FirestoreTimestamp) => string
  onButtonPress: (id: string, action: string) => void
}

const MAX_SWIPE_DISTANCE = 50

const PaymentBubble: React.FC<PaymentBubbleProps> = ({
  payment,
  name,
  showDateDivider,
  formatDate,
  formatTime,
  onButtonPress,
}) => {
  const panX = useRef(new Animated.Value(0)).current
  const isSentByUser = payment.fromUser
  const isPayment = payment.status === "payment" || payment.status === "accepted"
  const isPending = payment.status === "pending"

  const handleGesture = Animated.event([{ nativeEvent: { translationX: panX } }], {
    useNativeDriver: false,
    listener: (event: any) => {
      const translationX = event.nativeEvent.translationX

      if (isSentByUser) {
        if (translationX < -MAX_SWIPE_DISTANCE) {
          panX.setValue(-MAX_SWIPE_DISTANCE)
        } else if (translationX > 0) {
          panX.setValue(0)
        }
      } else {
        if (translationX > MAX_SWIPE_DISTANCE) {
          panX.setValue(MAX_SWIPE_DISTANCE)
        } else if (translationX < 0) {
          panX.setValue(0)
        }
      }
    },
  })

  const handleGestureEnd = () => {
    Animated.spring(panX, {
      toValue: 0,
      useNativeDriver: false,
    }).start()
  }

  return (
    <View>
      {showDateDivider && <Text style={styles.dateDivider}>{formatDate(payment.date)}</Text>}
      <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGestureEnd}>
        <Animated.View
          style={[
            styles.messageContainer,
            {
              transform: [{ translateX: panX }],
              alignSelf: isSentByUser ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Text style={isSentByUser ? styles.timeRight : styles.timeLeft}>{formatTime(payment.date)}</Text>
          {isPayment && (
            <View style={[styles.messageBubble, isSentByUser ? styles.send : styles.receive]}>
              {payment.status === "accepted" ? (
                <Text style={styles.statusText}>{isSentByUser ? `${name} godtok` : `Du godtok`} betalingen på</Text>
              ) : (
                <Text style={styles.statusText}>{isSentByUser ? `Du sendte ${name}` : `${name} sendte deg`}</Text>
              )}
              <Text style={styles.amountText}>{new Intl.NumberFormat("nb-NO").format(payment.amount)} kr</Text>
              {payment.message && <Text style={styles.statusText}>{payment.message}</Text>}
            </View>
          )}
          {!isPayment && (
            <View
              style={[
                styles.messageBubble,
                isSentByUser ? { borderBottomRightRadius: 2 } : { borderBottomLeftRadius: 2 },
                isPending ? { backgroundColor: "#a6f1f7" } : { backgroundColor: "#e0dede" },
              ]}
            >
              {isPending ? (
                <Text style={styles.statusText}>{isSentByUser ? `Du ber ${name} om` : `${name} ber deg om`}</Text>
              ) : (
                <Text style={styles.statusText}>{isSentByUser ? `${name} avslo` : `Du avslo`} betalingen på</Text>
              )}
              <Text style={styles.amountText}>{new Intl.NumberFormat("nb-NO").format(payment.amount)} kr</Text>
              {payment.message && <Text style={styles.statusText}>{payment.message}</Text>}
              {isSentByUser ? (
                <TouchableOpacity
                  style={{ ...styles.requestButton, backgroundColor: "#f55f5f" }}
                  onPress={() => onButtonPress(payment.id, "cancel")}
                >
                  <Text style={styles.buttonText}>Avbryt</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: "row", gap: 30 }}>
                  <TouchableOpacity
                    style={{ ...styles.requestButton, backgroundColor: "#71f55f" }}
                    onPress={() => onButtonPress(payment.id, "accept")}
                  >
                    <Text style={styles.buttonText}>Godta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.requestButton, backgroundColor: "#f55f5f" }}
                    onPress={() => onButtonPress(payment.id, "reject")}
                  >
                    <Text style={styles.buttonText}>Avslå</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
    marginHorizontal: 20,
    maxWidth: "70%",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
  },
  send: {
    backgroundColor: "#f8d7da",
    borderBottomRightRadius: 2,
  },
  receive: {
    backgroundColor: "#d1e7dd",
    borderBottomLeftRadius: 2,
  },
  statusText: {
    fontSize: 16,
  },
  amountText: {
    fontSize: 24,
  },
  dateDivider: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#555",
  },
  timeRight: {
    position: "absolute",
    right: -60,
    bottom: 0,
    color: "#999",
  },
  timeLeft: {
    position: "absolute",
    left: -55,
    bottom: 0,
    color: "#999",
  },
  requestButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
  },
})

export default PaymentBubble
