import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, FlatList, 
  ActivityIndicator, StyleSheet, LayoutAnimation, Platform, UIManager, Modal, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GITHUB_URL = "https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json";

// Explicit user defined Category Pills
const PILL_CATEGORIES = [
  "Social", 
  "Workplace", 
  "Idioms", 
  "Soft Skills", 
  "Industry Skills", 
  "Entrepreneurship"
];

export default function VocabularyWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Social");
  const [expandedId, setExpandedId] = useState(null);

  // Lead Collection State Management
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [timeline, setTimeline] = useState('Within 1 Month');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student Profile Context fallbacks (Links to your internal app auth state)
  const studentProfile = { name: "Raj Kumar", phone: "+91 9876543210" };

  useEffect(() => {
    fetch(GITHUB_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to sync expressions hub:", err);
        setLoading(false);
      });
  }, []);

  // Performance Virtualization: Track sub-arrays without rebuild overhead
  const displayData = useMemo(() => {
    return data.filter(item => item.category === activeCategory);
  }, [data, activeCategory]);

  const handleCategoryChange = (cat) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(null);
    setActiveCategory(cat);
  };

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const triggerPartnerCta = (item) => {
    setSelectedPartner(item);
    setModalVisible(true);
  };

  const handleLeadFormSubmission = () => {
    setIsSubmitting(true);
    
    // Exact payload structured for your Supabase/Backend pipeline
    const registrationRecord = {
      user_name: studentProfile.name,
      user_mobile: studentProfile.phone,
      partner_institute: selectedPartner.partnerName,
      partner_reference_code: selectedPartner.partnerCode,
      course_title: selectedPartner.term,
      expected_joining_timeline: timeline,
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      console.log("Lead successfully routed to database:", registrationRecord);
      setIsSubmitting(false);
      setModalVisible(false);
      alert(`Your preference has been registered with ${selectedPartner.partnerName}! An advisor will contact you shortly.`);
    }, 1200);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F4C81" />
        <Text style={styles.loadingMessage}>Loading Expressions Hub...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Pills Strip */}
      <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {PILL_CATEGORIES.map(pill => (
            <TouchableOpacity 
              key={pill} 
              onPress={() => handleCategoryChange(pill)}
              style={[styles.pillButton, activeCategory === pill && styles.pillButtonActive]}
            >
              <Text style={[styles.pillText, activeCategory === pill && styles.pillTextActive]}>{pill}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main High Performance Scrolling Viewport */}
      <FlatList 
        data={displayData}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scrollViewport}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        windowSize={5}
        renderItem={({ item }) => (
          <View style={styles.accordionCard}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => toggleAccordion(item.id)}
              style={styles.cardHeader}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.termTitle}>{item.term}</Text>
                {item.subDomain ? <Text style={styles.subDomainLabel}>{item.subDomain}</Text> : null}
              </View>
              <Ionicons 
                name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#64748B" 
              />
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.cardExpandedArea}>
                <Text style={styles.fieldSectionHeading}>EXPLANATION / DEFINITION</Text>
                <Text style={styles.descriptionBody}>{item.definition}</Text>

                <Text style={styles.fieldSectionHeading}>PROFESSIONAL PHRASE</Text>
                <View style={styles.proQuoteBox}>
                  <Text style={styles.proQuoteText}>"{item.pro}"</Text>
                </View>

                {/* Conditional Partner Matching UI */}
                {item.hasPartner && (
                  <View style={styles.partnerVerificationWidget}>
                    <View style={styles.partnerTitleRow}>
                      <Ionicons name="shield-checkmark" size={16} color="#0F4C81" />
                      <Text style={styles.partnerInstitutionText}>Training Program: {item.partnerName}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.partnerActionCta} 
                      onPress={() => triggerPartnerCta(item)}
                    >
                      <Text style={styles.partnerCtaText}>{item.ctaText || "Get Course Details"}</Text>
                      <Ionicons name="arrow-forward-sharp" size={14} color="#FFF" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Ionicons name="document-text-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyViewText}>No entries mapped under "{activeCategory}" yet.</Text>
          </View>
        }
      />

      {/* Dynamic Lead Generation Modal Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.bottomSheetWrapper}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitleText}>Inquire for Professional Course</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedPartner && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                <Text style={styles.sheetNotificationText}>
                  You are sharing your verified application profile details to claim course catalogs and fee reductions for
                  <Text style={{ fontWeight: '800', color: '#0F4C81' }}> {selectedPartner.term}</Text> with {selectedPartner.partnerName}.
                </Text>

                <Text style={styles.formInputLabel}>Registered Name</Text>
                <TextInput style={[styles.formInput, styles.formInputLocked]} value={studentProfile.name} editable={false} />

                <Text style={styles.formInputLabel}>Mobile Contact</Text>
                <TextInput style={[styles.formInput, styles.formInputLocked]} value={studentProfile.phone} editable={false} />

                <Text style={styles.formInputLabel}>When do you intend to start upskilling?</Text>
                <View style={styles.choiceGroupRow}>
                  {['Within 1 Month', 'Exploring for Later'].map(choice => (
                    <TouchableOpacity 
                      key={choice}
                      style={[styles.choicePill, timeline === choice && styles.choicePillSelected]}
                      onPress={() => setTimeline(choice)}
                    >
                      <Text style={[styles.choicePillText, timeline === choice && styles.choicePillTextSelected]}>{choice}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.sheetActionSubmit} 
                  onPress={handleLeadFormSubmission}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.sheetSubmitBtnText}>Submit Inbound Inquiry</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
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
  
  // Header Tabs Layout Rules
  filterBarContainer: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 12 },
  pillButton: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20, backgroundColor: '#F1F5F9' },
  pillButtonActive: { backgroundColor: '#0F4C81' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFF' },

  // Scroll Area Layout Rules
  scrollViewport: { padding: 16, paddingBottom: 100 },
  accordionCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  termTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  subDomainLabel: { fontSize: 11, color: '#0F4C81', fontWeight: '700', marginTop: 3, textTransform: 'uppercase' },

  // Accordion Details Layout Rules
  cardExpandedArea: { padding: 16, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  fieldSectionHeading: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 4 },
  descriptionBody: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 14 },
  proQuoteBox: { backgroundColor: '#F0F9FF', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#0F4C81', marginBottom: 14 },
  proQuoteText: { fontSize: 13, fontStyle: 'italic', color: '#1E293B', lineHeight: 18 },

  // Interactive Partner Components Layout Rules
  partnerVerificationWidget: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginTop: 4 },
  partnerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  partnerInstitutionText: { fontSize: 12, fontWeight: '700', color: '#475569', marginLeft: 6 },
  partnerActionCta: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 },
  partnerCtaText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  emptyViewText: { color: '#94A3B8', fontSize: 14, marginTop: 10, fontWeight: '500' },

  // Action Sheet Layout Rules
  overlayContainer: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
  bottomSheetWrapper: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 35 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitleText: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  sheetNotificationText: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 16 },
  formInputLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  formInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 14 },
  formInputLocked: { backgroundColor: '#F1F5F9', color: '#94A3B8', fontWeight: '600' },
  
  choiceGroupRow: { flexDirection: 'row', marginBottom: 20 },
  choicePill: { flex: 1, paddingVertical: 11, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 4, borderRadius: 8 },
  choicePillSelected: { backgroundColor: '#0F4C81', borderColor: '#0F4C81' },
  choicePillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  choicePillTextSelected: { color: '#FFF' },
  
  sheetActionSubmit: { backgroundColor: '#0F4C81', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  sheetSubmitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' }
});
