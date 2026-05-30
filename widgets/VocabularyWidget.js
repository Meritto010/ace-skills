import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, FlatList, 
  ActivityIndicator, StyleSheet, LayoutAnimation, Platform, UIManager, Modal, TextInput, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase'; // Ensure this points to your supabase.js

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GITHUB_URL = "https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json";

const PILL_CATEGORIES = [
  "Social", "Workplace", "Idioms", "Soft Skills", "Industry Skills", "Entrepreneurship"
];

export default function VocabularyWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Social");
  const [expandedId, setExpandedId] = useState(null);

  // Lead Collection State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [timeline, setTimeline] = useState('Within 1 Month');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState({ name: '', phone: '' });

  useEffect(() => {
    // 1. Fetch vocabulary data
    fetch(GITHUB_URL)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });

    // 2. Fetch User from Storage
    async function loadUser() {
      const name = await AsyncStorage.getItem('userName') || 'User';
      const phone = await AsyncStorage.getItem('userPhone') || 'Not provided';
      setStudent({ name, phone });
    }
    loadUser();
  }, []);

  const handleLeadFormSubmission = async () => {
    setIsSubmitting(true);
    
    // Connect to Supabase
    const { error } = await supabase.from('inquiries').insert([{
      name: student.name,
      phone: student.phone,
      course: selectedPartner.term,
      created_at: new Date().toISOString()
    }]);

    if (error) {
      Alert.alert("Submission Failed", "Please check your connection and try again.");
    } else {
      Alert.alert("Success", "Your inquiry has been sent!");
      setModalVisible(false);
    }
    setIsSubmitting(false);
  };

  const displayData = useMemo(() => data.filter(item => item.category === activeCategory), [data, activeCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {PILL_CATEGORIES.map(pill => (
            <TouchableOpacity 
              key={pill} 
              onPress={() => { setActiveCategory(pill); setExpandedId(null); }}
              style={[styles.pillButton, activeCategory === pill && styles.pillButtonActive]}
            >
              <Text style={[styles.pillText, activeCategory === pill && styles.pillTextActive]}>{pill}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={displayData}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scrollViewport}
        renderItem={({ item }) => (
          <View style={styles.accordionCard}>
            <TouchableOpacity onPress={() => setExpandedId(expandedId === item.id ? null : item.id)} style={styles.cardHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.termTitle}>{item.term}</Text>
                {item.subDomain ? <Text style={styles.subDomainLabel}>{item.subDomain}</Text> : null}
              </View>
              <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.cardExpandedArea}>
                <Text style={styles.fieldSectionHeading}>EXPLANATION / DEFINITION</Text>
                <Text style={styles.descriptionBody}>{item.definition}</Text>
                
                {item.hasPartner && (
                  <View style={styles.partnerVerificationWidget}>
                    <TouchableOpacity style={styles.partnerActionCta} onPress={() => { setSelectedPartner(item); setModalVisible(true); }}>
                      <Text style={styles.partnerCtaText}>{item.ctaText || "Get Course Details"}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.overlayContainer}>
          <View style={styles.bottomSheetWrapper}>
            <Text style={styles.sheetTitleText}>Inquire for {selectedPartner?.term}</Text>
            
            <Text style={styles.formInputLabel}>Registered Name</Text>
            <TextInput style={[styles.formInput, styles.formInputLocked]} value={student.name} editable={false} />
            
            <Text style={styles.formInputLabel}>Mobile Contact</Text>
            <TextInput style={[styles.formInput, styles.formInputLocked]} value={student.phone} editable={false} />

            <TouchableOpacity style={styles.sheetActionSubmit} onPress={handleLeadFormSubmission} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.sheetSubmitBtnText}>Submit Inbound Inquiry</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 15, alignItems: 'center'}}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, marginTop: 40 },
  loadingMessage: { marginTop: 14, fontSize: 14, color: '#64748B', fontWeight: '600' },
  filterBarContainer: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 12 },
  pillButton: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20, backgroundColor: '#F1F5F9' },
  pillButtonActive: { backgroundColor: '#0F4C81' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFF' },
  scrollViewport: { padding: 16, paddingBottom: 100 },
  accordionCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  termTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  subDomainLabel: { fontSize: 11, color: '#0F4C81', fontWeight: '700', marginTop: 3, textTransform: 'uppercase' },
  cardExpandedArea: { padding: 16, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  fieldSectionHeading: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 4 },
  descriptionBody: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 14 },
  partnerVerificationWidget: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginTop: 4 },
  partnerActionCta: { backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  partnerCtaText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
  bottomSheetWrapper: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 35 },
  sheetTitleText: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  formInputLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  formInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 14 },
  formInputLocked: { backgroundColor: '#F1F5F9', color: '#94A3B8', fontWeight: '600' },
  sheetActionSubmit: { backgroundColor: '#0F4C81', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  sheetSubmitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' }
});
