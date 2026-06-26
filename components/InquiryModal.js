import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const COURSES_URL = "https://raw.githubusercontent.com/Meritto010/courses/refs/heads/main/courses.json";

export default function InquiryModal({ visible, onClose, student = { name: '', phone: '', selectedCourse: '' }, setStudent }) {
  const [courses, setCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(COURSES_URL)
      .then(res => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  const handleLeadFormSubmission = async () => {
    const currentStudent = student || {};
    if (!currentStudent.name || !currentStudent.phone || !currentStudent.selectedCourse) {
      Alert.alert("Incomplete", "Please fill all fields and select a course.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('inquiries').insert([{
      name: currentStudent.name, 
      phone: currentStudent.phone, 
      course: currentStudent.selectedCourse, 
      created_at: new Date().toISOString()
    }]);
    if (error) {
      Alert.alert("Submission Failed", "Please try again later.");
    } else {
      setShowSuccess(true);
      if (setStudent) setStudent({ name: '', phone: '', selectedCourse: '' });
    }
    setIsSubmitting(false);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.avoidingView}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.sheet}>
              {showSuccess ? (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <Ionicons name="checkmark-circle" size={60} color="#0F4C81" />
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Inquiry Received!</Text>
                  <TouchableOpacity onPress={() => { setShowSuccess(false); onClose(); }} style={styles.submit}>
                    <Text style={styles.btnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="close" size={24} color="#64748B" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Inquiry Form</Text>
                    <View style={{ width: 24 }} />
                  </View>

                  <TextInput style={styles.input} placeholder="Name" value={student?.name || ''} onChangeText={(t) => setStudent({...student, name: t})} />
                  <TextInput style={styles.input} placeholder="Mobile" keyboardType="phone-pad" value={student?.phone || ''} onChangeText={(t) => setStudent({...student, phone: t})} />
                  
                  <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Text>{student?.selectedCourse || "Choose a course..."}</Text>
                    <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdownList}>
                      {courses.filter(c => c.hasPartner).map((c, i) => (
                        <TouchableOpacity key={i} style={styles.option} onPress={() => { setStudent({...student, selectedCourse: c.term}); setIsDropdownOpen(false); }}>
                          <Text>{c.term}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity style={styles.submit} onPress={handleLeadFormSubmission} disabled={isSubmitting}>
                     {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Submit Inquiry</Text>}
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  avoidingView: { width: '100%' },
  sheet: { 
    backgroundColor: '#FFF', 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 40, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 10 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8 },
  dropdownList: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginTop: 5, backgroundColor: '#FAFAFA' },
  option: { padding: 12, borderBottomWidth: 1, borderColor: '#EEE' },
  submit: { backgroundColor: '#0F4C81', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cancelButton: { marginTop: 25, alignItems: 'center', marginBottom: 10 },
  cancelText: { color: '#64748B', fontWeight: '600' }
});
