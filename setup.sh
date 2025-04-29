# This file will clone, install, and run
# the latest GlacierOS on any device
# with NodeJS and npm installed.

echo [glacierOS -- script started]
if [ ! -d "GlacierOS" ]; then
  echo "[glacierOS -- not installed, setting up]"
  git clone https://github.com/klashdevelopment/GlacierOS.git
  cd GlacierOS/glacier-server || exit
  npm install
  cd ../.. || exit
fi

echo "[glacierOS -- starting]"
cd GlacierOS/glacier-server || exit
if [ ! -d "node_modules" ]; then
  echo "[glacierOS -- installing dependencies]"
  npm install
fi
npm start
