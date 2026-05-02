import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

interface Drug {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  price: string;
  packSize: string;
}

interface GenericDrug {
  id: string;
  genericName: string;
  brands: Drug[];
  lowestPrice: string;
  highestPrice: string;
}

// Define colors inline to avoid import issues
const Colors = {
  background: '#000000',
  surface: '#080808',
  surfaceElevated: '#121212',
  text: '#FFFFFF',
  textSecondary: '#888888',
  textTertiary: '#555555',
  border: '#1A1A1A',
  accent: '#007AFF',
  accentCritical: '#FF3B30',
  erBackground: '#1A0000',
  erBorder: '#FF3B30',
};

const DIMSView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneric, setSelectedGeneric] = useState<GenericDrug | null>(null);
  const [bottomSheetModalRef, setBottomSheetModalRef] = useState<BottomSheetModal | null>(null);

  // Mock drug data
  const mockDrugs: Drug[] = [
    {
      id: '1',
      brandName: 'Napa',
      genericName: 'Paracetamol',
      strength: '500mg',
      dosageForm: 'Tablet',
      manufacturer: 'Square',
      price: '৳25',
      packSize: '10 tablets',
    },
    {
      id: '2',
      brandName: 'Ace',
      genericName: 'Paracetamol',
      strength: '500mg',
      dosageForm: 'Tablet',
      manufacturer: 'Beximco',
      price: '৳20',
      packSize: '10 tablets',
    },
    {
      id: '3',
      brandName: 'Pyridal',
      genericName: 'Paracetamol',
      strength: '500mg',
      dosageForm: 'Tablet',
      manufacturer: 'Incepta',
      price: '৳18',
      packSize: '10 tablets',
    },
    {
      id: '4',
      brandName: 'Amoxil',
      genericName: 'Amoxicillin',
      strength: '500mg',
      dosageForm: 'Capsule',
      manufacturer: 'Square',
      price: '৳120',
      packSize: '10 capsules',
    },
    {
      id: '5',
      brandName: 'Augmentin',
      genericName: 'Amoxicillin/Clavulanate',
      strength: '625mg',
      dosageForm: 'Tablet',
      manufacturer: 'GSK',
      price: '৳250',
      packSize: '14 tablets',
    },
  ];

  // Group drugs by generic name
  const genericDrugs = useMemo(() => {
    const grouped: { [key: string]: Drug[] } = {};
    
    mockDrugs.forEach(drug => {
      if (!grouped[drug.genericName]) {
        grouped[drug.genericName] = [];
      }
      grouped[drug.genericName].push(drug);
    });

    return Object.entries(grouped).map(([genericName, brands]) => ({
      id: genericName,
      genericName,
      brands: brands.sort((a, b) => {
        const priceA = parseInt(a.price.replace('৳', ''));
        const priceB = parseInt(b.price.replace('৳', ''));
        return priceA - priceB;
      }),
      lowestPrice: brands[0].price,
      highestPrice: brands[brands.length - 1].price,
    }));
  }, []);

  // Filter drugs based on search query
  const filteredDrugs = useMemo(() => {
    if (!searchQuery.trim()) return mockDrugs;
    
    const query = searchQuery.toLowerCase();
    return mockDrugs.filter(drug =>
      drug.brandName.toLowerCase().includes(query) ||
      drug.genericName.toLowerCase().includes(query) ||
      drug.manufacturer.toLowerCase().includes(query) ||
      drug.strength.toLowerCase().includes(query)
    );
  }, [searchQuery, mockDrugs]);

  // Handle drug card press
  const handleDrugPress = useCallback((drug: Drug) => {
    Vibration.vibrate(10);
    // Navigate to drug details
  }, []);

  // Handle generic name press
  const handleGenericPress = useCallback((generic: GenericDrug) => {
    Vibration.vibrate(15);
    setSelectedGeneric(generic);
    bottomSheetModalRef?.present();
  }, [bottomSheetModalRef]);

  // Render drug card
  const renderDrugCard = ({ item }: { item: Drug }) => (
    <TouchableOpacity
      style={styles.drugCard}
      onPress={() => handleDrugPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.drugInfo}>
        <Text style={styles.brandName}>{item.brandName}</Text>
        <Text style={styles.genericName}>{item.genericName} {item.strength}</Text>
        <Text style={styles.manufacturer}>{item.manufacturer}</Text>
      </View>
      
      <View style={styles.drugMeta}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <Text style={styles.packSize}>{item.packSize}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render alternative brand in bottom sheet
  const renderAlternativeBrand = ({ item }: { item: Drug }) => (
    <TouchableOpacity
      style={styles.alternativeCard}
      onPress={() => {
        Vibration.vibrate(10);
        bottomSheetModalRef?.dismiss();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.alternativeInfo}>
        <Text style={styles.alternativeBrandName}>{item.brandName}</Text>
        <Text style={styles.alternativeManufacturer}>{item.manufacturer}</Text>
      </View>
      <View style={styles.alternativePricing}>
        <Text style={styles.alternativePrice}>{item.price}</Text>
        <Text style={styles.alternativePackSize}>{item.packSize}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Drug Intelligence</Text>
        <Text style={styles.headerSubtitle}>Search 21,700+ Bangladeshi brands</Text>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search brand, generic, manufacturer..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Drug list */}
      <FlatList
        data={filteredDrugs}
        renderItem={renderDrugCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Bottom sheet for alternative brands */}
      <BottomSheetModal
        ref={(ref) => setBottomSheetModalRef(ref)}
        index={0}
        snapPoints={['50%', '80%']}
        backgroundStyle={styles.bottomSheetBackground}
        handleStyle={styles.bottomSheetHandle}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedGeneric && (
            <>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>{selectedGeneric.genericName}</Text>
                <Text style={styles.bottomSheetSubtitle}>
                  {selectedGeneric.lowestPrice} - {selectedGeneric.highestPrice}
                </Text>
              </View>
              
              <FlatList
                data={selectedGeneric.brands}
                renderItem={renderAlternativeBrand}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.bottomSheetList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: Colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  drugCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drugInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  genericName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  manufacturer: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  drugMeta: {
    alignItems: 'flex-end',
  },
  priceBadge: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  packSize: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.surfaceElevated,
  },
  bottomSheetHandle: {
    backgroundColor: Colors.border,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.textSecondary,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bottomSheetHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomSheetList: {
    paddingHorizontal: 0,
  },
  alternativeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeBrandName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  alternativeManufacturer: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  alternativePricing: {
    alignItems: 'flex-end',
  },
  alternativePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 2,
  },
  alternativePackSize: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});

export default DIMSView;
