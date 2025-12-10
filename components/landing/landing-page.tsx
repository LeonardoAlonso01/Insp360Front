"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Check,
  Star,
  Building2,
  TrendingUp,
  Lock,
  Mail,
  Menu,
  X as XIcon,
} from "lucide-react"

interface LandingPageProps {
  onLoginClick: () => void
  onSignUpClick: () => void
}

export default function LandingPage({ onLoginClick, onSignUpClick }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: FileText,
      title: "Gestão Completa de Inspeções",
      description: "Crie, gerencie e finalize inspeções de forma digital e organizada. Elimine papeladas e processos manuais.",
      color: "bg-green-500",
    },
    {
      icon: CheckCircle,
      title: "Checklist Inteligente",
      description: "Sistema de checklist personalizável com validações automáticas e rastreamento em tempo real.",
      color: "bg-blue-500",
    },
    {
      icon: BarChart3,
      title: "Relatórios e Dashboards",
      description: "Visualize métricas importantes, acompanhe o progresso das inspeções e tome decisões baseadas em dados.",
      color: "bg-purple-500",
    },
    {
      icon: Shield,
      title: "Conformidade e Auditoria",
      description: "Mantenha todos os registros organizados e acessíveis para auditorias e conformidade regulatória.",
      color: "bg-red-500",
    },
    {
      icon: Users,
      title: "Colaboração em Equipe",
      description: "Trabalhe em equipe com múltiplos usuários, atribua responsabilidades e acompanhe o progresso.",
      color: "bg-orange-500",
    },
    {
      icon: Zap,
      title: "Automação de Processos",
      description: "Automatize tarefas repetitivas e acelere o fluxo de trabalho das suas inspeções.",
      color: "bg-yellow-500",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "R$ 99",
      period: "/mês",
      description: "Ideal para pequenas equipes",
      features: [
        "Até 50 inspeções/mês",
        "3 usuários",
        "Relatórios básicos",
        "Suporte por email",
        "Armazenamento de 5GB",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "R$ 299",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Inspeções ilimitadas",
        "Usuários ilimitados",
        "Relatórios avançados",
        "Suporte prioritário",
        "Armazenamento de 50GB",
        "API de integração",
        "Treinamento da equipe",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Soluções sob medida",
      features: [
        "Tudo do Professional",
        "Suporte 24/7",
        "Armazenamento ilimitado",
        "Integrações customizadas",
        "Gerente de conta dedicado",
        "SLA garantido",
        "On-premise disponível",
      ],
      popular: false,
    },
  ]

  const testimonials = [
    {
      quote: "O Insp360 transformou completamente nosso processo de inspeções. Reduzimos o tempo de finalização em 60% e eliminamos completamente os erros de documentação.",
      author: "Maria Silva",
      role: "Gerente de Qualidade",
      company: "TechCorp",
    },
    {
      quote: "A facilidade de uso e os relatórios detalhados nos ajudam a manter a conformidade e identificar problemas antes que se tornem críticos.",
      author: "João Santos",
      role: "Diretor de Operações",
      company: "Indústria Moderna",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Insp360</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Preços
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sobre
              </a>
              <Button variant="ghost" onClick={onLoginClick} className="text-gray-600 hover:text-gray-900">
                Entrar
              </Button>
              <Button onClick={onSignUpClick} className="bg-gray-900 hover:bg-gray-800 text-white">
                Começar grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
              <a href="#features" className="block text-gray-600 hover:text-gray-900">
                Recursos
              </a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900">
                Preços
              </a>
              <a href="#about" className="block text-gray-600 hover:text-gray-900">
                Sobre
              </a>
              <Button variant="ghost" onClick={onLoginClick} className="w-full justify-start">
                Entrar
              </Button>
              <Button onClick={onSignUpClick} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Começar grátis
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-red-100 text-red-700 hover:bg-red-100">
              Plataforma de Inspeções Inteligente
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Automação e gestão para equipes de{" "}
              <span className="text-red-600">inspeção modernas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              O Insp360 é a primeira plataforma que automatiza workflows complexos de inspeção e
              fornece insights em tempo real para sua equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onSignUpClick}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg"
              >
                Começar agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-2"
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Saiba mais <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-12">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h3 className="text-lg font-semibold">Dashboard de Inspeções</h3>
                      <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">142</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Em Progresso</p>
                        <p className="text-2xl font-bold text-blue-600">28</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Concluídas</p>
                        <p className="text-2xl font-bold text-green-600">114</p>
                      </div>
                    </div>
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-blue-600 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xl text-gray-600 mb-12">
            Muitas planilhas, trabalho manual e sistemas que não se comunicam? Líderes de qualidade
            hoje enfrentam uma escolha.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-300 bg-gray-900 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Sistemas desconectados</h3>
                <p className="text-gray-300 mb-6">
                  Dados isolados, trabalho manual e processos fragmentados.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <span className="mr-2">✗</span>
                    <span>Planilhas desorganizadas</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <span className="mr-2">✗</span>
                    <span>Processos manuais</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <span className="mr-2">✗</span>
                    <span>Falta de visibilidade</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-500 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Insp360</h3>
                    <p className="text-gray-600">Solução unificada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gestão de inspeções, do início ao fim
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                    <a href="#" className="text-red-600 hover:text-red-700 mt-4 inline-flex items-center text-sm font-medium">
                      Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-2xl text-gray-900 font-medium leading-relaxed mb-6">
                  {testimonials[0].quote}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{testimonials[0].author}</p>
                    <p className="text-gray-600">
                      {testimonials[0].role}, {testimonials[0].company}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button variant="outline" className="border-2">
                  Ler caso de sucesso <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI/Advanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tecnologia construída para inspeções</h2>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 mt-4">
              Explorar recursos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Automação inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  O Insp360 automatiza tarefas repetitivas, valida dados e fornece insights,
                  liberando sua equipe para focar em trabalho estratégico.
                </CardDescription>
                <a href="#" className="text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center text-sm font-medium">
                  Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Centro de comando unificado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  O Insp360 oferece uma visão unificada de todos os seus dados, workflows e
                  insights. Personalize dashboards e relatórios conforme suas necessidades.
                </CardDescription>
                <a href="#" className="text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center text-sm font-medium">
                  Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Esqueça a reconciliação manual</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  O Insp360 reconcilia automaticamente dados em todos os seus sistemas,
                  eliminando erros manuais e garantindo precisão. Menos tempo em reconciliação,
                  mais tempo em análise.
                </CardDescription>
                <a href="#" className="text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center text-sm font-medium">
                  Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos que crescem com você</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para sua equipe. Todos os planos incluem teste gratuito de 14
              dias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${
                  plan.popular ? "border-red-500 shadow-2xl scale-105" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-600 text-white px-4 py-1">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                    onClick={onSignUpClick}
                  >
                    Começar agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Sobre o Insp360
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                O Insp360 é uma plataforma SaaS moderna desenvolvida para transformar a forma como
                empresas gerenciam inspeções e garantem qualidade. Nossa missão é eliminar
                processos manuais e fornecer ferramentas inteligentes que aumentam a produtividade
                e reduzem erros.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Com anos de experiência em gestão de qualidade e conformidade, desenvolvemos uma
                solução que atende desde pequenas equipes até grandes corporações, sempre com foco
                em simplicidade, eficiência e resultados.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">+500 empresas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">+10.000 usuários</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">99.9% uptime</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Por que escolher o Insp360?</h3>
                <div className="space-y-3">
                  {[
                    "Interface intuitiva e fácil de usar",
                    "Implementação rápida e sem complicações",
                    "Suporte técnico especializado",
                    "Atualizações constantes e melhorias",
                    "Segurança de dados de nível enterprise",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Coloque suas inspeções no piloto automático</h2>
          <p className="text-xl text-gray-300 mb-8">
            Veja como o Insp360 pode transformar suas operações de qualidade. Comece hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignUpClick}
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              Começar agora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => {
                // Scroll to pricing
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Solicitar demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Insp360</span>
              </div>
              <p className="text-sm">
                Plataforma de gestão de inspeções para equipes modernas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrações
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 Insp360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}