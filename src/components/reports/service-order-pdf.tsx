import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Register fonts if needed, otherwise use standard fonts
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    headerRight: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    logoSubtext: {
        fontSize: 10,
        color: '#64748B',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#334155',
    },
    subtitle: {
        fontSize: 10,
        color: '#64748B',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#475569',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 100,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748B',
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#334155',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '50%',
        marginBottom: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#94A3B8',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 10,
    },
    statusBadge: {
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 10,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
});

const statusColors: any = {
    NEW: '#3B82F6', // blue
    SCHEDULED: '#F59E0B', // amber
    IN_PROGRESS: '#6366F1', // indigo
    COMPLETED: '#10B981', // emerald
    BILLED: '#8B5CF6', // violet
    CANCELLED: '#EF4444', // red
};

const serviceTypeLabel: any = {
    PULVERIZATION: "Pulverização",
    DISPERSION: "Dispersão",
};

interface ServiceOrderPDFProps {
    order: any; // Using any for simplicity, but preferably should use strict types
}

export const ServiceOrderPDF = ({ order }: ServiceOrderPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.logoText}>AEROTECH</Text>
                    <Text style={styles.logoSubtext}>Drones Agrícolas e Tecnologia</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.title}>Ordem de Serviço</Text>
                    <Text style={styles.subtitle}>#{order.id.slice(-6).toUpperCase()}</Text>
                    <View style={{
                        ...styles.statusBadge,
                        backgroundColor: statusColors[order.status] || '#94A3B8',
                        color: 'white'
                    }}>
                        <Text>{order.status}</Text>
                    </View>
                </View>
            </View>

            {/* Client Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados do Cliente</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nome:</Text>
                            <Text style={styles.value}>{order.client.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Documento:</Text>
                            <Text style={styles.value}>{order.client.document || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Contato:</Text>
                            <Text style={styles.value}>{order.client.contactPerson || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{order.client.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Telefone:</Text>
                            <Text style={styles.value}>{order.client.phone || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Cidade/UF:</Text>
                            <Text style={styles.value}>
                                {order.client.city ? `${order.client.city}/${order.client.state}` : 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Service Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.value}>{serviceTypeLabel[order.serviceType] || order.serviceType}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Área:</Text>
                            <Text style={styles.value}>{order.areaSize} hectares</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Local:</Text>
                            <Text style={styles.value}>{order.location || 'Não informado'}</Text>
                        </View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Data Agendada:</Text>
                            <Text style={styles.value}>
                                {order.scheduledDate ? format(new Date(order.scheduledDate), "P", { locale: ptBR }) : 'Pendente'}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Taxa de Aplicação:</Text>
                            <Text style={styles.value}>{order.applicationRate ? `${order.applicationRate} L/ha` : 'N/A'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Descrição/Observações:</Text>
                    <Text style={{ ...styles.value, marginTop: 5 }}>{order.description || 'Nenhuma observação registrada.'}</Text>
                </View>
            </View>

            {/* Financial Info (Optional - hide if user has no permission, currently showing all) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Financeiras</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Preço por Hectare:</Text>
                    <Text style={styles.value}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.pricePerHa)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Valor Total:</Text>
                    <Text style={[styles.value, { fontWeight: 'bold' }]}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalPrice)}
                    </Text>
                </View>
            </View>

            {/* Signatures */}
            <View style={{ ...styles.section, marginTop: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                    <View style={{ alignItems: 'center', width: '40%' }}>
                        <View style={{ borderTopWidth: 1, borderTopColor: '#000', width: '100%', marginBottom: 5 }} />
                        <Text style={{ fontSize: 10 }}>Responsável Aerotech</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: '40%' }}>
                        <View style={{ borderTopWidth: 1, borderTopColor: '#000', width: '100%', marginBottom: 5 }} />
                        <Text style={{ fontSize: 10 }}>Cliente / Responsável</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Aerotech Drones Brasil - Tecnologia de Precisão no Campo
                {"\n"}
                Gerado em {format(new Date(), "PPpp", { locale: ptBR })}
            </Text>
        </Page>
    </Document>
);
