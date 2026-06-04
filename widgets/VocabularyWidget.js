import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, FlatList, 
  ActivityIndicator, StyleSheet, Modal, TextInput, Alert, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VOCAB_URL = "https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json";
const COURSES_URL = "https://raw.githubusercontent.com/Meritto010/courses/refs/heads/main/courses.json";

export default function VocabularyWidget() {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Social");
  const [expandedId, setExpandedId] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [student, setStudent] = useState({ name: '', phone: '', selectedCourse: '' });

  useEffect(() => {
    fetch(VOCAB_URL).then(res => res.json()).then(setData);
    fetch(COURSES_URL).then(res => res.json()).then(setCourses).catch(console.error);
  }, []);

  const categories = useMemo(() => [...new Set(data.map(item => item.category))], [data]);
  const filteredData = useMemo(() => data.filter(item => item.category === activeCategory), [data, activeCategory]);

  const handleLeadFormSubmission = async () => {
    if (!student.name || !student.phone || !student.selectedCourse) {
      Alert.alert("Incomplete", "Please fill all fields and select a course.");
      return;
    }
    setIsSubmitting(true);
    
    const { error } = await supabase.from('inquiries').insert([{
      name: student.name, 
      phone: student.phone, 
      course: student.selectedCourse, 
      created_at: new Date().toISOString()
    }]);

    if (error) {
      Alert.alert("Submission Failed", "Please try again later.");
    } else {
      setShowSuccess(true);
      setStudent({ name: '', phone: '', selectedCourse: '' });
    }
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.globalCta} onPress={() => setModalVisible(true)}>
        <Text style={styles.globalCtaText}>Explore Premium Courses</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillContainer}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} style={[styles.pill, activeCategory === cat && styles.pillActive]} onPress={() => { setActiveCategory(cat); setExpandedId(null); }}>
            <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList 
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpandedId(expandedId === item.id ? null : item.id); }} style={styles.cardHeader}>
              <Text style={styles.term}>{item.term}</Text>
              <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.expanded}><Text style={styles.def}>{item.definition}</Text></View>
            )}
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.overlay}><View style={styles.sheet}>
          {showSuccess ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Ionicons name="checkmark-circle" size={60} color="#0F4C81" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>Inquiry Received!</Text>
              <Text style={{ textAlign: 'center', color: '#64748B', marginBottom: 20, lineHeight: 20 }}>
                Thank you for your interest. Our team will review your details and contact you shortly regarding the next steps.
              </Text>
              <TouchableOpacity onPress={() => { setShowSuccess(false); setModalVisible(false); }} style={styles.submit}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Inquiry Form</Text>
              <TextInput style={styles.input} placeholder="Name" value={student.name} onChangeText={(t) => setStudent({...student, name: t})} />
              <TextInput style={styles.input} placeholder="Mobile" keyboardType="phone-pad" value={student.phone} onChangeText={(t) => setStudent({...student, phone: t})} />
              
              <Text style={styles.label}>Select Course:</Text>
              <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Text style={styles.selectedText}>{student.selectedCourse || "Choose a course..."}</Text>
                <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {courses.filter(c => c.hasPartner === true).map((c, i) => (
                    <TouchableOpacity key={i} style={styles.option} onPress={() => { setStudent({...student, selectedCourse: c.term}); setIsDropdownOpen(false); }}>
                      <Text>{c.term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.submit} onPress={handleLeadFormSubmission} disabled={isSubmitting}>
                 {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Submit Inquiry</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 15, alignItems: 'center'}}><Text>Cancel</Text></TouchableOpacity>
            </>
          )}
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  globalCta: { backgroundColor: '#0F4C81', padding: 15, margin: 15, borderRadius: 8, alignItems: 'center' },
  globalCtaText: { color: '#FFF', fontWeight: 'bold' },
  pillContainer: { flexGrow: 0, paddingHorizontal: 15, marginBottom: 10 },
  pill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10 },
  pillActive: { backgroundColor: '#0F4C81' },
  pillText: { fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFF' },
  card: { padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  term: { fontSize: 16, fontWeight: 'bold' },
  expanded: { marginTop: 10, padding: 10, backgroundColor: '#FAFAFA', borderRadius: 8 },
  def: { color: '#334155' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 10 },
  label: { fontWeight: 'bold', marginVertical: 10 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8 },
  dropdownList: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginTop: 5, backgroundColor: '#FAFAFA' },
  option: { padding: 12, borderBottomWidth: 1, borderColor: '#EEE' },
  selectedText: { color: '#333' },
  submit: { backgroundColor: '#0F4C81', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
