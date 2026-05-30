import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import VocabularyWidget from '../widgets/VocabularyWidget';

export default function VocabularyScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Meritto010/courses/main/courses.json')
      .then(res => res.json())
      .then(data => {
        const courses = data.courses || data;
        setCourseList(courses);
        if (courses.length > 0) setSelectedCourse(courses[0].title);
      });
  }, []);

  const submitInquiry = async () => {
    if (!userName || !userPhone) return Alert.alert("Required", "Please fill all fields.");
    const { error } = await supabase.from('inquiries').insert([{ name: userName, phone: userPhone, course: selectedCourse }]);
    if (error) Alert.alert("Submission Failed", "Try again.");
    else { Alert.alert("Success", "Inquiry sent!"); setModalVisible(false); }
  };

  return (
    <View style={styles.screenWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Professional Expressions</Text>
        </View>
        
        <VocabularyWidget />
        
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>Inquire Course</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Inquire for Course</Text>
              <Picker selectedValue={selectedCourse} onValueChange={setSelectedCourse} style={styles.picker}>
                {courseList.map(c => <Picker.Item key={c.id} label={c.title} value={c.title} />)}
              </Picker>
              <TextInput placeholder="Name" style={styles.input} value={userName} onChangeText={setUserName} />
              <TextInput placeholder="Mobile" style={styles.input} value={userPhone} onChangeText={setUserPhone} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.submitBtn} onPress={submitInquiry}>
                <Text style={styles.btnText}>Submit Inbound Inquiry</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 18, fontWeight: '900', marginLeft: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  picker: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, marginVertical: 8, borderRadius: 8 },
  submitBtn: { backgroundColor: '#0F4C81', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#0F4C81', padding: 15, borderRadius: 30 },
  fabText: { color: '#FFF', fontWeight: 'bold' }
});