# Cocktail REST API

## Opis projektu
Niniejszy projekt to proste REST API oparte na **Node.js** i **Express**, umożliwiające zarządzanie koktajlami i składnikami w bazie danych **MariaDB**. API pozwala na dodawanie, edytowanie, usuwanie i pobieranie (jednego lub wszystkich) koktajli oraz ich składników. Ponadto możliwe jest zarówno filtrowanie chociażby po składnikach, zawartości alkoholu jak i sortowanie po nazwie czy kategorii.

**Poniżej przedstawiam krok po kroku jak wszytsko uruchomić, a następnie opiszę dokładnie moją koncepcję na niniejszy projekt**

## Krok po kroku jak uruchomić projekt na nowym urządzeniu

### 1. Klonowanie repozytorium

Aby rozpocząć, sklonuj repozytorium na nowe urządzenie:
```
git clone https://github.com/Siemoniere/Cocktail-REST-API.git
cd Cocktail-REST-API
```
### 2. Instalacja zależności

W folderze głównym projektu uruchom poniższe polecenie, aby zainstalować wszystkie zależności:
```
npm install
```
To zainstaluje wszystkie pakiety wymineione w pliku package.json, takie jak Express, Mocha, Chai, Supertest oraz inne zależności wymagane do uruchomienia projektu.

### 3. Rozpakowanie bazy danych i konfiguracja pliku .env

Zaloguj sie do MariaDB (zakładam że już masz tam konto):
```
mysql -u <twoj_login> -p
```
Po wprowadzeniu hasła utwórz baze danych i wyjdź:
```
CREATE DATABASE <twoja_nazwa_bazy>;
EXIT;
```
W głównym katalogu projektu uruchom import z pliku backup.sql:
```
mysql -u <twoj_login> -p <twoja_nazwa_bazy> < backup.sql
```
Teraz również w głównym katalogu projektu zmodyfikuj plik .env i wypełnij go swoimi danymi, aby wyglądał następująco (dodałem go do repo na potrzeby łatwej synchronizacji):
```
DB_HOST=localhost
DB_USER=<twoj_login>
DB_PASSWORD=<twoje_haslo>
DB_NAME=<twoja_nazwa_bazy>
PORT=3006
```
### 4. Uruchomienie

Teraz uruchom Postmana (możesz też użyć curl) i serwer poleceniem:
```
node server.js
```

## Opis koncepcji projektu

### Baza danych MariaDB
Ze względu na to, że już jestem oswojony z bazami danych, cały projekt rozpocząłem od stworzenia bazy danych. Poniżej znajduje się projekt mojej bazy:

https://github.com/Siemoniere/Cocktail-REST-API/blob/master/Cocktails.pdf

Ze względu na relację many-to-many stworzyłem dodatkową tabelę cocktail-ingredient trzymającą dany składnik dla danego koktalju wraz z ilością i jednostką miary.
Ponadto w bazie stworzyłem triggery automatycznie usuwające wszystkie rekordy z tejże tabeli przy każdym usuniętym i zaktualizowanym koktajlu.

### Serwer i obsługa zapytań

Do postawienia serwera użyłem Express.js, a obsługę wszystkich endpointów dla składników i koktajli zawarłem w katalogu routes. W katalogu controllers znajduje sie cała logika ogarniania zapytań. Znajdują tam się wszystkie warunki zapewniające szczelność bazy (np. nie można dodac koktajlu, gdy jakikolwiek jego składnik nie znajduje się w tabeli ingredients).

### Przykład uzycia

