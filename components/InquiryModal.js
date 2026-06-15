import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert 
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
    // Safety check: Ensure student object exists
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
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {showSuccess ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Ionicons name="checkmark-circle" size={60} color="#0F4C81" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Inquiry Received!</Text>
              <Text style={{ textAlign: 'center', color: '#64748B', marginBottom: 20, lineHeight: 20 }}>
                Thank you for your interest. Our team will contact you shortly.
              </Text>
              <TouchableOpacity onPress={() => { setShowSuccess(false); onClose(); }} style={styles.submit}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Inquiry Form</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Name" 
                value={student?.name || ''} 
                onChangeText={(t) => setStudent({...student, name: t})} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Mobile" 
                keyboardType="phone-pad" 
                value={student?.phone || ''} 
                onChangeText={(t) => setStudent({...student, phone: t})} 
              />
              
              <Text style={styles.label}>Select Course:</Text>
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
              <TouchableOpacity onPress={onClose} style={{marginTop: 15, alignItems: 'center'}}><Text>Cancel</Text></TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 10 },
  label: { fontWeight: 'bold', marginVertical: 10 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8 },
  dropdownList: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginTop: 5, backgroundColor: '#FAFAFA' },
  option: { padding: 12, borderBottomWidth: 1, borderColor: '#EEE' },
  submit: { backgroundColor: '#0F4C81', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
