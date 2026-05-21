# Zasady Wyliczania Cen w Systemie FerrOS (V4.3)

Niniejszy dokument opisuje algorytmy i reguły biznesowe stosowane do kalkulacji stawek w modułach rezerwacji pasażerskiej, cargo oraz w silniku Yield Management.

## 1. Algorytm Dynamicznego Pozycjonowania (Yield Management)
System automatycznie modyfikuje ceny bazowe w oparciu o trendy popytu i aktualne obłożenie jednostek.

### 1.1 Mnożniki Dnia Tygodnia (Seasonal Daily Multipliers)
Modyfikują cenę bazową biletu oraz stawkę za metr bieżący cargo:
- **Piątek i Niedziela (Weekend Peak)**: `x1.45` (+45%)
- **Sobota (High Demand)**: `x1.25` (+25%)
- **Wtorek i Środa (Mid-week Promo)**: `x0.90` (-10%)
- **Poniedziałek i Czwartek (Standard)**: `x1.00`

### 1.2 Progi Obłożenia (Occupancy Buckets)
Mnożniki kumulatywne zależne od poziomu rezerwacji zasobów:
- **0-50% obłożenia**: `x1.00`
- **51-75% obłożenia**: `x1.20`
- **76-90% obłożenia**: `x1.50`
- **>90% obłożenia**: `x2.00` (Last minute premium)

## 2. Kalkulacja Pasażerska (B2C)

### 2.1 Wzór ogólny
`Suma = [(Cena_Bazowa * Mnożnik_Dnia * Liczba_Dorosłych) + (Cena_Bazowa * Mnożnik_Dnia * 0.5 * Liczba_Dzieci) + (50 PLN * Zwierzęta) + Dodatek_Pojazd + Dodatek_Kabina] * Mnożnik_Powrotny`

### 2.2 Taryfy Pasażerskie
- **Osoba dorosła**: 100% ceny dnia.
- **Dziecko (do 12 lat)**: 50% ceny dnia.
- **Zwierzę (pies/kot)**: 50 PLN (stała opłata).

### 2.3 Dodatki za Pojazdy (Standard)
- **Samochód osobowy (do 6m)**: +180 PLN
- **Motocykl / Skuter**: +90 PLN
- **Autobus**: +650 PLN

### 2.4 Dodatki za Zakwaterowanie
- **Miejsce pokładowe (Fotel lotniczy)**: 0 PLN
- **Kabina 2-os wewnętrzna**: +180 PLN
- **Apartament LUX (Sea View)**: +550 PLN

### 2.5 Podróż w obie strony (Round Trip)
- Zastosowanie mnożnika **1.8x** do sumy obu odcinków (efektywny rabat 10% na całą podróż).

## 3. Kalkulacja Cargo / Fracht (B2B)

`Suma = [Długość_Zestawu * (45 PLN * Mnożnik_Dnia) + (Liczba_Kierowców - 1) * 120 PLN] * Mnożnik_Powrotny`

- **Stawka bazowa**: 45 PLN za metr bieżący (lane meter).
- **Drugi kierowca**: +120 PLN (ryczałt obejmujący wyżywienie i miejsce w kabinie driver-pool).
- **ADR (Materiały Niebezpieczne)**: Dodatkowa opłata +25% do frachtu netto.

## 4. Dopłaty Obowiązkowe i Podatki
Doliczane do każdej rezerwacji końcowej:
- **BAF (Bunker Adjustment Factor)**: 20 PLN / pojazd (dodatek paliwowy).
- **ETS (Environmental Surcharge)**: 5 PLN / pasażera (podatek węglowy).
- **VAT**: 8% (transport osób), 23% (usługi pokładowe, fracht).

## 5. Rabaty i Program Lojalnościowy
- **Kody Rabatowe**: Obliczane od sumy przed dopłatami BAF/ETS.
- **Punkty Lojalnościowe**: 100 pkt = 10 PLN zniżki (max 50% wartości biletu).

---
*Dokumentacja techniczna FerrOS v4.3*
*Status: OBOWIĄZUJĄCY*