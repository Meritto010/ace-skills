import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const COURSES_URL = "https://raw.githubusercontent.com/Meritto010/courses/refs/heads/main/courses.json";

export default function InquiryModal({
  visible,
  onClose,
  student = { name: '', phone: '', selectedCourse: '' },
  setStudent
}) {
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

    if (
      !currentStudent.name ||
      !currentStudent.phone ||
      !currentStudent.selectedCourse
    ) {
      Alert.alert(
        "Incomplete",
        "Please fill all fields and select a course."
      );
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: currentStudent.name,
          phone: currentStudent.phone,
          course: currentStudent.selectedCourse,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      Alert.alert(
        "Submission Failed",
        "Please try again later."
      );
    } else {
      setShowSuccess(true);

      if (setStudent) {
        setStudent({
          name: '',
          phone: '',
          selectedCourse: ''
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {showSuccess ? (
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle"
                size={60}
                color="#0F4C81"
              />

              <Text style={styles.successTitle}>
                Inquiry Received!
              </Text>

              <Text style={styles.successMessage}>
                Thank you for your interest. Our team will contact you shortly.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                style={styles.submit}
              >
                <Text style={styles.btnText}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >

              <View style={styles.header}>
                <Text style={styles.title}>
                  Inquiry Form
                </Text>

                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={24}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Name"
                value={student?.name || ''}
                onChangeText={(t) =>
                  setStudent({
                    ...student,
                    name: t
                  })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Mobile"
                keyboardType="phone-pad"
                value={student?.phone || ''}
                onChangeText={(t) =>
                  setStudent({
                    ...student,
                    phone: t
                  })
                }
              />

              <Text style={styles.label}>
                Select Course:
              </Text>

              <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() =>
                  setIsDropdownOpen(!isDropdownOpen)
                }
              >
                <Text>
                  {student?.selectedCourse ||
                    "Choose a course..."}
                </Text>

                <Ionicons
                  name={
                    isDropdownOpen
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <ScrollView
                  style={styles.dropdownList}
                  nestedScrollEnabled={true}
                >
                  {courses
                    .filter(c => c.hasPartner)
                    .map((c, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.option}
                        onPress={() => {
                          setStudent({
                            ...student,
                            selectedCourse: c.term
                          });

                          setIsDropdownOpen(false);
                        }}
                      >
                        <Text>{c.term}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.submit}
                onPress={handleLeadFormSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnText}>
                    Submit Inquiry
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },

  sheet: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },

  label: {
    fontWeight: 'bold',
    marginVertical: 10
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#FAFAFA',
    maxHeight: 180
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },

  submit: {
    backgroundColor: '#0F4C81',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15
  },

  btnText: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  cancelButton: {
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center'
  },

  cancelText: {
    color: '#64748B',
    fontWeight: '600'
  },

  successContainer: {
    alignItems: 'center',
    padding: 20
  },

  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10
  },

  successMessage: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20
  }
});
