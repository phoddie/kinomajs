#
#     Copyright (C) 2010-2016 Marvell International Ltd.
#     Copyright (C) 2002-2010 Kinoma, Inc.
#
#     Licensed under the Apache License, Version 2.0 (the "License");
#     you may not use this file except in compliance with the License.
#     You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.
#
# use $(TMP_DIR)/crypt to put object/archive files, and $(DEST_DIR)/crypt to put all xsb files
# assume CC, AR, C_OPTIONS, XSC_OPTIONS are exported

CRYPT_JS_SRCS = \
	crypt_aead.js  \
	crypt_aes.js \
	crypt_ber.js \
	crypt_cbc.js \
	crypt_chacha.js \
	crypt_cipher.js \
	crypt_ctr.js \
	crypt_des.js \
	crypt_digest.js \
	crypt_dsa.js \
	crypt_ecb.js \
	crypt_ecdsa.js \
	crypt_ed25519.js \
	crypt_hkdf.js \
	crypt_hmac.js \
	crypt_md5.js \
	crypt_mode.js \
	crypt_oaep.js \
	crypt_pkcs1.js \
	crypt_pkcs1_5.js \
	crypt_pkcs8.js \
	crypt_rc4.js \
	crypt_rng.js \
	crypt_rsa.js \
	crypt_sha1.js \
	crypt_sha224.js \
	crypt_sha256.js \
	crypt_sha384.js \
	crypt_sha512.js \
	crypt_srp.js \
	crypt_stream.js \
	crypt_tdes.js \
	crypt_x509.js

CRYPT_C_SRCS = \
	crypt_aes.c \
	crypt_cbc.c \
	crypt_chacha.c \
	crypt_cipher.c \
	crypt_ctr.c \
	crypt_des.c \
	crypt_digest.c \
	crypt_ecb.c \
	crypt_md5.c \
	crypt_mode.c \
	crypt_rc4.c \
	crypt_rng.c \
	crypt_sha1.c \
	crypt_sha224.c \
	crypt_sha256.c \
	crypt_sha384.c \
	crypt_sha512.c \
	crypt_srp.c \
	crypt_stream.c \
	crypt_tdes.c \
	crypt_x509.c

ARITH_JS_SRCS = \
	arith_ec.js \
	arith_ecp.js \
	arith_ed.js \
	arith_int.js \
	arith_mod.js \
	arith_mont.js \
	arith_z.js

ARITH_C_SRCS = \
	arith_ec.c \
	arith_ecp.c \
	arith_ed.c \
	arith_int.c \
	arith_mod.c \
	arith_mont.c \
	arith_z.c

CRYPT_BINARIES = $(addprefix $(DEST_DIR)/crypt/, $(addsuffix .xsb, $(patsubst crypt_%,%,$(basename $(CRYPT_JS_SRCS)))))
ARITH_BINARIES = $(addprefix $(DEST_DIR)/arith/, $(addsuffix .xsb, $(patsubst arith_%,%,$(basename $(ARITH_JS_SRCS)))))
CRYPT_OBJS = $(addprefix $(TMP_DIR)/crypt/, $(addsuffix .o, $(basename $(CRYPT_C_SRCS))))
ARITH_OBJS = $(addprefix $(TMP_DIR)/crypt/, $(addsuffix .o, $(basename $(ARITH_C_SRCS))))
CRYPT_DLS = $(addprefix $(DEST_DIR)/crypt/, $(addsuffix .so, $(patsubst crypt_%,%,$(basename $(CRYPT_C_SRCS)))))
ARITH_DLS = $(addprefix $(DEST_DIR)/arith/, $(addsuffix .so, $(patsubst arith_%,%,$(basename $(ARITH_C_SRCS)))))

ifndef XS_ARCHIVE
CRYPT_OBJS += $(addprefix $(TMP_DIR)/crypt/, $(addsuffix .xs.o, $(basename $(CRYPT_C_SRCS))))
ARITH_OBJS += $(addprefix $(TMP_DIR)/crypt/, $(addsuffix .xs.o, $(basename $(ARITH_C_SRCS))))
endif

LOCAL_OBJS = $(CRYPT_OBJS) $(ARITH_OBJS) $(TMP_DIR)/crypt/kcl.o
LOCAL_BINARIES = $(CRYPT_BINARIES) $(ARITH_BINARIES)
LOCAL_LIBS = $(TMP_DIR)/libkcl.a

ifndef CRYPT_DIR
CRYPT_DIR = $(F_HOME)/xs6/sources/mc/extensions/crypt
endif

C_OPTIONS += $(MOD_C_OPTIONS)

.PHONY: archive

all: archive $(CRYPT_DLS) $(ARITH_DLS)

archive: $(TMP_DIR)/crypt $(DEST_DIR)/arith $(DEST_DIR)/crypt $(LOCAL_LIBS) $(DEST_DIR)/crypt.xsb $(DEST_DIR)/arith.xsb $(LOCAL_BINARIES) $(LOCAL_OBJS)

$(TMP_DIR)/crypt:
	mkdir -p $(TMP_DIR)/crypt
$(DEST_DIR)/crypt:
	mkdir -p $(DEST_DIR)/crypt
$(DEST_DIR)/arith:
	mkdir -p $(DEST_DIR)/arith

# kcl
KCL_OBJS = $(addprefix $(TMP_DIR)/crypt/, bn.o chacha.o fips180.o fips197.o fips46.o kcl_arith.o kcl_symmetric.o rc.o rfc1321.o)
$(TMP_DIR)/libkcl.a: $(KCL_OBJS)
	$(AR) cr $@ $(KCL_OBJS)
$(KCL_OBJS): $(TMP_DIR)/crypt/%.o: $(CRYPT_DIR)/kcl/%.c
	$(CC) $< $(C_OPTIONS) -c -o $@

# rules
$(DEST_DIR)/%.xsb: $(TMP_DIR)/%.xsb
	cp -p $< $@
$(DEST_DIR)/crypt/%.xsb: $(TMP_DIR)/crypt/crypt_%.xsb
	cp -p $< $@
$(DEST_DIR)/arith/%.xsb: $(TMP_DIR)/crypt/arith_%.xsb
	cp -p $< $@
$(TMP_DIR)/%.xsb: $(CRYPT_DIR)/%.js
	$(XS6_TOOL_DIR)/xsc6 $(XSC_OPTIONS) -c -o $(TMP_DIR) $<
$(TMP_DIR)/crypt/%.xsb: $(CRYPT_DIR)/%.js
	$(XS6_TOOL_DIR)/xsc6 $(XSC_OPTIONS) -c -o $(TMP_DIR)/crypt $<

$(TMP_DIR)/crypt/%.o : $(CRYPT_DIR)/%.c
	$(CC) -c $(C_OPTIONS) -I$(CRYPT_DIR)/kcl $< -o $@

$(DEST_DIR)/crypt/%.so: $(TMP_DIR)/crypt/crypt_%.o $(TMP_DIR)/crypt/crypt_%.xs.o
	$(CC) $(C_OPTIONS) $(MOD_LINK_OPTIONS) -o $@ $*.o $(LOCAL_LIBS)
$(DEST_DIR)/arith/%.so: $(TMP_DIR)/crypt/arith_%.o $(TMP_DIR)/crypt/arith_%.xs.o
	$(CC) $(C_OPTIONS) $(MOD_LINK_OPTIONS) -o $@ $*.o $(LOCAL_LIBS)

clean:
	rm -f $(LOCAL_OBJS) $(LOCAL_LIBS) $(addsuffix .d, $(basename $(LOCAL_OBJS)))
	rm -f $(KCL_OBJS) $(addsuffix .d, $(basename $(KCL_OBJS)))
	rm -f $(TMP_DIR)/crypt.xsb $(TMP_DIR)/arith.xsb
