import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, StatusBar, Platform, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase'; // Ensure this points to your supabase.js
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('SAP Material Management (MM)');

  useEffect(() => {
    checkLicense();
    // Fetch course list from your separate courses repo
    fetch('https://raw.githubusercontent.com/Meritto010/courses/main/courses.json')
      .then(res => res.json())
      .then(data => setCourseList(data.courses))
      .catch(err => console.error("Courses load error:", err));
  }, []);

  const checkLicense = async () => {
    const status = await AsyncStorage.getItem('@is_activated');
    setIsPro(status === 'true');
  };

  const submitInquiry = async () => {
    if (!userName || !userPhone) return Alert.alert("Required", "Please fill all fields.");

    const { error } = await supabase.from('inquiries').insert([{
      name: userName,
      phone: userPhone,
      course: selectedCourse
    }]);

    if (error) {
      Alert.alert("Submission Failed", "Please try again.");
    } else {
      Alert.alert("Success", "Inquiry sent!");
      setModalVisible(false);
    }
  };

  if (!isPro) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed" size={50} color="#0F4C81" />
        <Text style={styles.lockedText}>Feature Locked</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Activation')} style={styles.btn}>
          <Text style={{ color: '#FFF' }}>Activate Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Expressions</Text>
      </View>
      
      <VocabularyWidget />
      
      {/* Floating Action Button to trigger Inquiry Modal */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{color: '#FFF', fontWeight: 'bold'}}>Inquire Course</Text>
      </TouchableOpacity>

      {/* Inquiry Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Inquire for Course</Text>
            <TextInput placeholder="Name" style={styles.input} value={userName} onChangeText={setUserName} />
            <TextInput placeholder="Mobile" style={styles.input} value={userPhone} onChangeText={setUserPhone} keyboardType="phone-pad" />
            <TouchableOpacity style={styles.submitBtn} onPress={submitInquiry}>
              <Text style={{color: '#FFF'}}>Submit Inbound Inquiry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: '900', marginLeft: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 10, marginVertical: 10, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  submitBtn: { backgroundColor: '#0F4C81', padding: 15, borderRadius: 8, alignItems: 'center' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#0F4C81', padding: 15, borderRadius: 30 }
});